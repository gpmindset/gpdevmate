import {OpenAiClient} from "./providers/openai-client";
import {OllamaClient} from "./providers/ollama-client";
import {HuggingfaceClient} from "./providers/huggingface-client";
import {ILLMProvider} from "../interfaces";

export class LLMProviderFactory {
    static getProvider(): ILLMProvider {
        const provider = process.env.MODEL_PROVIDER;

        switch (provider) {
            case "openai":
                return new OpenAiClient();
            case "ollama":
                return new OllamaClient();
            case "hf":
                return new HuggingfaceClient();
            default:
                throw new Error(`Unknown provider ${provider}`);
        }
    }
}