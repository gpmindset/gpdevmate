import chalk from "chalk";
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import {Logger} from "@gpdevmate/core";

export class ReviewReport {

    private markdownText: string = '';

    setMarkdownText(markdown: string) {
        this.markdownText = markdown.trim();
    }

    reportInConsole() {
        if (!this.markdownText) {
            Logger.warn('No review content to print.');
            return;
        }

        const lines = this.markdownText.split('\n');
        for (const line of lines) {
            const cleanedLine = line.replace(/\*\*(.*?)\*\*/g, chalk.bold('$1'));

            if (cleanedLine.startsWith('# ')) {
                console.log(chalk.blueBright.bold(cleanedLine.replace(/^# +/, '')));
            } else if (cleanedLine.startsWith('## ')) {
                console.log(chalk.blue(cleanedLine.replace(/^## +/, '')));
            } else if (cleanedLine.startsWith('- ')) {
                console.log(chalk.green('• ' + cleanedLine.slice(2)));
            } else if (/^`{3}/.test(cleanedLine)) {
                console.log(chalk.gray(cleanedLine));
            } else if (/^---+$/.test(cleanedLine)) {
                console.log(chalk.dim('─'.repeat(50)));
            } else {
                console.log(cleanedLine);
            }
        }
    }

    writeToMarkdown(filePath: string) {
        if (!this.markdownText) {
            Logger.warn('No review content to write. Skipping markdown output.');
            return;
        }

        let targetPath: string;

        if (!filePath) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            targetPath = path.join(process.cwd(), `code-review-${timestamp}.md`);
        } else {
            const resolvedPath = path.isAbsolute(filePath) ?
                filePath :
                path.resolve(process.cwd(), filePath)

            const parsed = path.parse(resolvedPath)
            const isDir = !parsed.base.includes(".") || parsed.ext === ""

            if (isDir) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                targetPath = path.join(resolvedPath, `code-review-${timestamp}.md`);
            } else {
                if (parsed.ext === ".md") {
                    targetPath = resolvedPath;
                } else {
                    let dir = path.dirname(resolvedPath)
                    let lastDir = path.basename(dir)
                    targetPath = path.join(dir,`${lastDir}.md`);
                }
            }
        }

        fs.writeFileSync(
            targetPath,
            this.markdownText,
            'utf-8'
        );

        Logger.info(`✅ Saved review to ${targetPath}`);
    }
}