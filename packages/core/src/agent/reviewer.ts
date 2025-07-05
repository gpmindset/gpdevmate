import {LLMClient} from "../interfaces";

export class Reviewer {
    constructor(private client: LLMClient) {}

    async review(prompt: string): Promise<string> {
        return this.client.callModel(prompt)
    }
}