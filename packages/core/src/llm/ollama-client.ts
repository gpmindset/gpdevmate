import {LLMClient} from "../interfaces";

export class OllamaClient implements LLMClient {
    async callModel(prompt: string): Promise<string> {
        return "Ollama should be called"
    }
}