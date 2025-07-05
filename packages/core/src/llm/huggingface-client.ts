import {LLMClient} from "../interfaces";

export class HuggingfaceClient implements LLMClient {
    callModel(prompt: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
}