import * as path from "node:path";
import * as os from "node:os";
import * as fs from "node:fs";
import {input, select} from "@inquirer/prompts";
import {Logger} from "@gpdevmate/core";

export class ConfigWizard {

    private static configDir = path.join(os.homedir(), '.gpdevmate')
    private static configPath = path.join(this.configDir, ".env")


    static isEnvExists(): boolean {
        return fs.existsSync(this.configPath);
    }

    static getConfigPath(): string {
        return this.configPath
    }

    static async pickMode(): Promise<string | undefined> {
        try {

            let mode: string;
            mode = await select({
                message: "Select Mode",
                choices: [
                    {
                        name: "OpenAI",
                        value: "openai"
                    },
                    {
                        name: "Local",
                        value: "local",
                        description: "Use Ollama to run models locally"
                    },
                    {
                        name: "API",
                        value: "api",
                        description: "Use Huggingface API to run models"
                    }
                ]
            });

            return mode

        } catch (error) {
            if (error instanceof Error && error.name === 'ExitPromptError') {
                // noop; silence this error
            } else {
                throw error;
            }
        }
    }

    static async run(mode: string) {
        try {

            if (!fs.existsSync(this.configDir)) {
                fs.mkdirSync(this.configDir, { recursive: true })
            }

            let prompts = {}

            switch (mode) {
                case "openai":
                    prompts = {
                        "OPENAI_API_KEY": await input({ message: "Enter your OpenAI API key:", validate: value => value.trim() !== "" || "API Key cannot be empty." }),
                        "OPENAI_BASE_URL": await input({ message: "Enter your OpenAI Base Url address: (default: https://api.openai.com/v1)", default: "https://api.openai.com/v1" }),
                    }
                    break;
                case "local":
                    prompts = {
                        "OLLAMA_HOST": await input({ message: "Enter your Ollama Host URL (default: http://localhost:11434):", default: "http://localhost:11434" })
                    }
                    break;
                case "api":
                    prompts = {
                        "HUGGINGFACE_API_KEY": await input({ message: "Enter your HuggingFace API key:", validate: (val) => val.trim() !== '' || 'API key cannot be empty' }),
                        "HUGGINGFACE_MODEL": await input({ message: "Enter the model name to use:", default: 'bigcode/starcoder' })
                    }
                    break;
                default:
                    Logger.error('Invalid mode. Use "openai", "local", or "api".');
                    return;
            }

            const envContent = Object.entries(prompts)
                .map(([k, v]) => `${k}=${v}`)
                .join('\n') + '\n';

            fs.writeFileSync(this.configPath, envContent, { encoding: 'utf-8' });
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