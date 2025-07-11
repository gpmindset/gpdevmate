import { ILLMProvider } from "../../interfaces";

export class OllamaClient implements ILLMProvider {

    private readonly model: string;
    private readonly endpoint: string;

    constructor() {
        this.model = process.env.OLLAMA_MODEL || "mistral";
        this.endpoint = process.env.OLLAMA_ENDPOINT || "http://localhost:11434";
    }

    async testConnection(): Promise<boolean> {
        try {
            const res = await fetch(`${this.endpoint}/api/tags`)
            return res.ok
        } catch (e) {
            return false;
        }
    }

    async reviewCode(prompt: string): Promise<string> {
        const res = await fetch(`${this.endpoint}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: this.model,
                prompt,
                stream: false
            })
        })

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Ollama Error: ${res.status} - ${text}`);
        }

        const data = await res.json() as any;
        return data.response?.trim() || ''
    }
}