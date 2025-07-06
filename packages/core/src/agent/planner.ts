import fs from "fs/promises"
import path from "path";
import {Utils} from "../utils";
import {PlannerConfig} from "../types";


const SKIP_DIRS = new Set([
    'node_modules',
    'dist',
    'build',
    '.next',
    '.git',
    '.turbo',
    '.cache',
    'coverage',
    '.vscode',
    '.idea'
]);

export class Planner {

    private readonly maxFiles: number = 5
    private readonly maxFileSize: number = 200 * 1024
    private skipDirs: Set<string>

    constructor(config: PlannerConfig) {
        this.maxFiles = config.maxFiles;
        this.skipDirs = new Set([...SKIP_DIRS, ...config.skipDirs]);
        this.maxFileSize = config.maxFileSizeBytes
    }

    async planFiles(target: string): Promise<string[]> {
        const resolvedPath = path.isAbsolute(target) ? target : path.resolve(process.cwd(), target);

        const stats  = await fs.stat(resolvedPath);

        if (stats.isFile()) {
            return [resolvedPath]
        }

        const entries = await fs.readdir(target, { withFileTypes: true });
        const files = await Promise.all(
            entries.map(entry => {
                const resolved = path.resolve(target, entry.name)
                if (entry.isDirectory()) {
                    if (this.skipDirs.has(entry.name)) return []
                    return this.planFiles(resolved)
                } else {
                    return [resolved]
                }
            })
        )

        return  Array.prototype.concat(...files)
    }

    async selectValidFiles(target: string): Promise<string[]> {
        const allFiles = await this.planFiles(target);

        const filtered = []

        for (const file of allFiles) {
            if (!Utils.isCodeFile(file)) continue;

            const stats = await fs.stat(file)
            if (stats.size > this.maxFileSize) continue;

            filtered.push(file)
            if (filtered.length >= this.maxFiles) break;
        }

        return filtered
    }

    async buildPrompt(files: string[]): Promise<string> {
        let batchPrompt = `You are a senior developer. Review the following code files and provide detailed feedback, improvements, and bug fixes.\n\n Please review the following files. For each file, give suggestions using Markdown formatting.
Use headers for filenames, bullet points for issues, and fenced code blocks for examples.\n\n`;

        for (const file of files) {
            const content = await fs.readFile(file, 'utf-8')
            const lang = Utils.getLanguage(file)
            batchPrompt += `File: ${path.basename(file)}\\n\\n\u0060\u0060\u0060${lang}\\n${content}\\n\u0060\u0060\u0060\\n\\n`
        }

        return batchPrompt;
    }
}