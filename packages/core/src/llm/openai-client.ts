import {OpenAI} from "openai";

export class OpenAiClient {

    private openai: OpenAI

    constructor(baseUrl: string = process.env.OPENAI_BASE_URL!, apiKey: string = process.env.OPENAI_API_KEY!, private model = "openai/gpt-4o-mini") {
        this.openai = new OpenAI({
            baseURL: baseUrl,
            apiKey: apiKey,
        })
    }

    async reviewCode(code: string, language: string): Promise<string> {

        const response = await this.openai.chat.completions.create({
            model: this.model,
            temperature: 0.2,
            max_completion_tokens: 2048,
            messages: [
                {
                    role: "system",
                    content: "You are a helpful senior developer reviewing code. Your job is to give detailed but concise suggestions, highlight bugs or bad patterns, and suggest improvements."
                },
                {
                    role: "user",
                    content: `Review the following ${language} code and give constructive feedback:\n\n\`\`\`${language}\n${code}\n\`\`\``
                }
            ]
        })

        return response.choices[0].message.content?.trim() || ""

    }
}