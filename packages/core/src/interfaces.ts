export interface LLMClient {
    callModel(prompt: string): Promise<string>
}