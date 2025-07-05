export class Utils {
    static estimateTokens(text: string) {
        return Math.ceil(text.length / 4)
    }

    static getLanguage(file: string) {
        if (file.endsWith(".js")) return "javascript"
        if (file.endsWith(".ts")) return "typescript"
        if (file.endsWith(".python")) return "python"
        if (file.endsWith('.java')) return 'java';
        if (file.endsWith('.cpp') || file.endsWith('.cc')) return 'cpp';
        if (file.endsWith('.cs')) return 'csharp';
        if (file.endsWith('.go')) return 'go';
        if (file.endsWith('.rs')) return 'rust';
        if (file.endsWith('.php')) return 'php';
        if (file.endsWith('.rb')) return 'ruby'
        return "plaintext"
    }

    static isCodeFile(file: string): boolean {
        return [
            '.ts', '.js', '.py', '.java', '.cpp', '.cc',
            '.cs', '.go', '.rs', '.php', '.rb'
        ].some(ext => file.endsWith(ext));
    }
}