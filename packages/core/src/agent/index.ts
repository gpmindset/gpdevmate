import {Planner} from "./planner";
import {Reviewer} from "./reviewer";
import {AgentOptions} from "../types";
import {OpenAiClient} from "../llm/openai-client";
import {OllamaClient} from "../llm/ollama-client";
import {HuggingfaceClient} from "../llm/huggingface-client";
import {Utils} from "../utils";
import path from "path";

export class CodeReviewAgent {
    private planner: Planner;
    private reviewer: Reviewer

    constructor(private options: AgentOptions) {
        this.planner =  new Planner({
            maxFiles: options.maxFiles,
            maxFileSizeBytes: options.maxFileSizeBytes,
            skipDirs: options.skipDirs,
        })

        const client =
            options.mode === "openai" ? new OpenAiClient() :
                options.mode === "local" ? new OllamaClient() :
                    new HuggingfaceClient()

        this.reviewer = new Reviewer(client)
    }

    async execute(): Promise<void> {
        try{
            const fullPath = path.resolve(process.cwd(), this.options.path)

            const files = await this.planner.selectValidFiles(fullPath)

            if (this.options.dryRun) {
                console.log('📦 Files to review:')
                files.forEach(f => console.log(`- ${f}`))
                return
            }

            const prompt = await this.planner.buildPrompt(files)
            const tokens = Utils.estimateTokens(prompt)

            if (tokens > 7000) {
                console.warn(`⚠️ Estimated ${tokens} tokens, may exceed model limits.`)
            }

            const feedback = await this.reviewer.review(prompt)
            console.log('\n🧠 AI Review Feedback:\n');
            console.log(feedback);
        } catch (error) {
            if (error instanceof Error && error.name === 'ExitPromptError') {
                // noop; silence this error
            } else {
                throw error;
            }
        }
    }
}