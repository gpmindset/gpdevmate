import { ILLMProvider } from "../../interfaces";

export class HuggingfaceClient implements ILLMProvider {
    reviewCode(prompt: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
}