export interface ILLMProvider {
    reviewCode(prompt: string): Promise<string>
    testConnection(): Promise<boolean>
}

export interface ILogger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    debug(message: string): void;
}