import { ILLMProvider } from "../../interfaces";

export class HuggingfaceClient implements ILLMProvider {
    testConnection(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    reviewCode(prompt: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
}