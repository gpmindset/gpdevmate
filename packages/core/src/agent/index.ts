import {Planner} from "./planner";
import {Reviewer} from "./reviewer";
import {AgentOptions} from "../types";
import {OpenAiClient} from "../llm/openai-client";
import {OllamaClient} from "../llm/ollama-client";
import {HuggingfaceClient} from "../llm/huggingface-client";
import {Utils} from "../utils";
import path from "path"
import {Logger} from "../logger";

export class CodeReviewAgent {
    private planner: Planner;
    private reviewer: Reviewer

    constructor(private options: AgentOptions) {
        this.planner =  new Planner({
            maxFiles: options.maxFiles,
            maxFileSizeBytes: options.maxFileSizeBytes,
            skipDirs: options.skipDirs,
        })

        const client =
            options.mode === "openai" ? new OpenAiClient() :
                options.mode === "local" ? new OllamaClient() :
                    new HuggingfaceClient()

        this.reviewer = new Reviewer(client)
    }

    async dryRun(): Promise<string[]> {
        const fullPath = path.resolve(process.cwd(), this.options.path)

        let files: string[];
        files = await this.planner.selectValidFiles(fullPath);

        return files;
    }

    async getReview(): Promise<string | undefined> {
        const fullPath = path.resolve(process.cwd(), this.options.path);

        Logger.info('📁 Scanning Files...');
        const files = await this.planner.selectValidFiles(fullPath);
        Logger.info(`✅ ${files.length} files selected for review.`);

        Logger.info('🧠 Building AI Prompt...');
        const prompt = await this.planner.buildPrompt(files);
        Logger.info(`✅ Prompt built successfully.`);

        Logger.info('📏 Estimating Tokens...');
        const tokens = Utils.estimateTokens(prompt);
        Logger.info(`Estimated token count: ${tokens}`);

        if (tokens > 7000) {
            Logger.warn(`Token count may exceed model limit! (${tokens})`);
        }

        Logger.info('🤖 Requesting AI Feedback...');
        const feedback = await this.reviewer.review(prompt);
        Logger.info(`✅ Feedback received.`);

        return feedback;
    }
}