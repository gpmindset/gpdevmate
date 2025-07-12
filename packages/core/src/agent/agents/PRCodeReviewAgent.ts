import {Logger} from "../../logger";
import {Utils} from "../../utils";
import {Reviewer} from "../reviewer";
import {PRAgentOptions, PRFiles, PRReview} from "../../types";
import {LLMProviderFactory} from "../../llm/llm-provider-factory";

export class PRCodeReviewAgent {
    private reviewer: Reviewer

    constructor(private options: PRAgentOptions) {
        const client = LLMProviderFactory.getProvider()

        this.reviewer = new Reviewer(client)
    }

    async filterValidPRFiles(files: PRFiles[]): Promise<PRFiles[]> {
        const filtered = []

        for (const file of files) {
            if (!Utils.isCodeFile(file.path)) continue;

            filtered.push(file)
            if (filtered.length >= this.options.maxFiles) break;
        }

        return filtered
    }


    async planFilesForPR(files: PRFiles[]) {

        const filteredPRFiles = await this.filterValidPRFiles(files)

        let snippets: Awaited<{ path: string; snippet: string } | null>[];
        snippets = await Promise.all(filteredPRFiles.map(async file => {
            try {

                const res = await fetch(file.content);
                if (!res.ok) throw new Error(`Failed to fetch file: ${file.path}`);

                const fullContent = await res.text();
                const snippet = await this.extractContextualSnippets(fullContent, file.patch || '', 5)
                return {
                    path: file.path,
                    snippet
                }
            } catch (e) {
                Logger.error(`⚠️ Failed to load content for ${file.path}: ${(e as Error).message}`)
                return null
            }
        }));

        return snippets
    }

    async extractContextualSnippets(content: string, patch: string, contextLines = 5): Promise<string> {

        if (!patch) {
            throw new Error(`No new patch found`);
        }

        const lines = content.split('\n');
        const snippetLines = new Set<number>();

        const regex = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm;
        let match;

        while ((match = regex.exec(patch))) {
            const startLine = parseInt(match[1], 10) - 1;
            const numLines = parseInt(match[2] || '1', 10);

            for (let i = startLine - contextLines; i < startLine + numLines + contextLines; i++) {
                if (i >= 0 && i < lines.length) snippetLines.add(i);
            }
        }

        const sortedLines = [...snippetLines].sort((a, b) => a - b);
        return sortedLines.map(i => lines[i]).join('\n');
    }

    private buildPrompt(files: { path: string; snippet: string }[]): string {
        const headerPrompt = `
            You are a senior software engineer reviewing a GitHub Pull Request.
            
            Below are code snippets from files that have been modified.
            
            Please:
            - Focus only on meaningful logic changes
            - **Do NOT comment on formatting, style, or nitpicks** unless they affect readability or correctness
            - If a file looks clean and idiomatic, just say: \`✅ No suggestions for this file.\`
            - Format the response using **Markdown**, grouped by file:
            
            ### \`[file path]\`
            - [Short and specific feedback]
            - ...
            
            If no issues found in a file, return:
            
            ### \`[file path]\`
            ✅ No suggestions for this file.
            
            Be professional, constructive, and concise — like a helpful senior dev doing a friendly code review.
            `.trim();



        const bodyPrompt = files.map(file => {
            const lang = Utils.getLanguage(file.path);
            return `
                ### \`${file.path}\`
                \`\`\`${lang}
                ${file.snippet}
                \`\`\`
               `;
        }).join('\n\n');

        return `${headerPrompt}\n\n${bodyPrompt}`;
    }

    async getReview(): Promise<PRReview[] | undefined> {
        try {

            Logger.info(`📦 Reviewing ${this.options.snippets.length} PR files...`);

            const snippets = await this.planFilesForPR(this.options.snippets)

            const filteredSnippets = snippets.filter((s): s is { path: string; snippet: string } => s !== null);

            if (!filteredSnippets.length) {
                throw new Error(`No changes Found for PR files...`);
            }

            const prompt = this.buildPrompt(filteredSnippets);

            const tokens = Utils.estimateTokens(prompt);
            Logger.info(`🧮 Token estimate: ${tokens}`);
            if (tokens > 7000) Logger.warn(`⚠️ Token limit warning! (${tokens})`);

            const feedback = await this.reviewer.review(prompt);
            if (!feedback) return [];

            return [{
                path: filteredSnippets[0]?.path ?? 'general',
                line: 1,
                comment: feedback,
            }];

        } catch (e) {
            Logger.error((e as Error).message)
        }
    }
}