import {ILLMProvider} from "../interfaces";

export class Reviewer {
    constructor(private client: ILLMProvider) {}

    async review(prompt: string): Promise<string> {
        return this.client.reviewCode(prompt)
    }
}