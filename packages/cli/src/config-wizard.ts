import * as path from "node:path";
import * as os from "node:os";
import * as fs from "node:fs";
import { input } from "@inquirer/prompts";

export class ConfigWizard {
    static async run(mode: string) {
        try {
            const configDir = path.join(os.homedir(), '.gpdevmate')
            const configPath = path.join(configDir, ".env")

            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true })
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
                    console.error('❌ Invalid mode. Use "openai", "local", or "api".');
                    return;
            }

            const envContent = Object.entries(prompts)
                .map(([k, v]) => `${k}=${v}`)
                .join('\n') + '\n';

            fs.writeFileSync(configPath, envContent, { encoding: 'utf-8' });
            console.log(`✅ Config saved to ${configPath}`);

        } catch (error) {
            if (error instanceof Error && error.name === 'ExitPromptError') {
                // noop; silence this error
            } else {
                throw error;
            }
        }
    }
}