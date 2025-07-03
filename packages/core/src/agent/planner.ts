import fs from "fs/promises"
import path from "path";
import * as console from "node:console";
import {ReviewTarget} from "../types";

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

const MAX_FILE_SIZE_BYTES = 500 * 1024; // 500 KB

export class Planner {
    async plan(target: string): Promise<ReviewTarget[]> {

        const target_files: ReviewTarget[] = []

        const walk = async (dir: string) => {
            const entries = await fs.readdir(dir, { withFileTypes: true })

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name)

                if (entry.isDirectory()) {
                    if (SKIP_DIRS.has(entry.name)) continue;
                    await walk(fullPath)
                } else if(entry.name.endsWith(".js") || entry.name.endsWith(".ts")) {
                    try {
                        const stats = await fs.stat(fullPath)
                        if (stats.size > MAX_FILE_SIZE_BYTES) continue;

                        const content = await fs.readFile(fullPath, 'utf-8')
                        target_files.push({ filePath: fullPath, content })
                    } catch (e) {
                        console.warn(`⚠️ Failed to read file: ${fullPath}`, e)
                    }
                }
            }
        }

        await walk(target)
        return target_files
    }
}