import * as path from "node:path";
import * as os from "node:os";
import * as fs from "node:fs";
import {input, select} from "@inquirer/prompts";
import {Logger} from "@gpdevmate/core";
import { parse } from "@dotenvx/dotenvx"

export class ConfigWizard {

    private static configDir = path.join(os.homedir(), '.gpdevmate')
    private static configPath = path.join(this.configDir, ".env")


    static isEnvExists(): boolean {
        return fs.existsSync(this.configPath);
    }

    static getConfigPath(): string {
        return this.configPath
    }

    private static updateEnv(updateData: object): void {
        const envContent = Object.entries(updateData)
            .map(([k, v]) => `${k}=${v}`)
            .join('\n') + '\n';

        fs.writeFileSync(this.configPath, envContent, { encoding: 'utf-8' });
    }

    private static getExistingEnv(): object {
        let existingEnv = {}
        if (fs.existsSync(this.configPath)) {
            existingEnv = parse(fs.readFileSync(this.configPath, "utf8"));
        }

        return existingEnv;
    }

    static async pickProvider(): Promise<string | undefined> {
        try {

            let provider: string;
            provider = await select({
                message: "Select Mode",
                choices: [
                    {
                        name: "OpenAI",
                        value: "openai"
                    },
                    {
                        name: "Ollama",
                        value: "ollama",
                        description: ""
                    },
                    {
                        name: "Huggingface",
                        value: "hf",
                        description: "Use Huggingface API to run models"
                    }
                ]
            });

            return provider

        } catch (error) {
            if (error instanceof Error && error.name === 'ExitPromptError') {
                // noop; silence this error
            } else {
                throw error;
            }
        }
    }

    static async setProvider(provider: string): Promise<void> {

        if (provider !== "openai" && provider !== "ollama" && provider !== "hf") {
            throw new Error("Invalid provider");
        }

        if (!fs.existsSync(this.configDir)) {
            fs.mkdirSync(this.configDir, { recursive: true })
        }

        const providerEnv = { "MODEL_PROVIDER": provider };

        const existingEnv = this.getExistingEnv();

        let updateProvider = { ...existingEnv, ...providerEnv };

        this.updateEnv(updateProvider);

        Logger.info(`✅ Provider changed to: ${provider}`);

    }

    static async run(provider: string) {
        try {

            if (!fs.existsSync(this.configDir)) {
                fs.mkdirSync(this.configDir, { recursive: true })
            }

            let existingEnv = this.getExistingEnv();

            let prompts = {}

            let updateModelProvider = { "MODEL_PROVIDER": provider }

            switch (provider) {
                case "openai":
                    prompts = {
                        "OPENAI_API_KEY": await input({ message: "Enter your OpenAI API key:", validate: value => value.trim() !== "" || "API Key cannot be empty." }),
                        "OPENAI_BASE_URL": await input({ message: "Enter your OpenAI Base Url address: (default: https://api.openai.com/v1)", default: "https://api.openai.com/v1" }),
                    }
                    break;
                case "ollama":
                    prompts = {
                        "OLLAMA_ENDPOINT": await input({ message: "Enter your Ollama Endpoint:", default: "http://localhost:11434" }),
                        "OLLAMA_MODEL": await input({ message: "Enter model name running through Ollama:", default: "codellama"})
                    }
                    break;
                case "hf":
                    prompts = {
                        "HUGGINGFACE_API_KEY": await input({ message: "Enter your HuggingFace API key:", validate: (val) => val.trim() !== '' || 'API key cannot be empty' }),
                        "HUGGINGFACE_MODEL": await input({ message: "Enter the model name to use:", default: 'bigcode/starcoder' })
                    }
                    break;
                default:
                    Logger.error('Invalid mode. Use "openai", "local", or "api".');
                    return;
            }

            let updateEnv = { ...existingEnv, ...prompts, ...updateModelProvider };

            this.updateEnv(updateEnv)
            Logger.info(`✅ Config saved to ${this.configPath}`);

        } catch (error) {
            if (error instanceof Error && error.name === 'ExitPromptError') {
                // noop; silence this error
            } else {
                throw error;
            }
        }
    }
}