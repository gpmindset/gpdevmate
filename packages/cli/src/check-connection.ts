import {ConfigWizard} from "./config-wizard";
import * as fs from "node:fs";
import {Logger, LLMProviderFactory} from "@sgprakas/gpdevmate-core";
import {config} from "@dotenvx/dotenvx";

export class CheckConnection {
    static async checkProvider() {
        let configPath = ConfigWizard.getConfigPath()
        if (!fs.existsSync(configPath)) {
            Logger.error("Could not find configuration file. Use `gpdevmate config` command to set configuration file.");
            throw new Error(`Could not find configuration file: ${configPath}`);
        }

        config({ path: configPath, quiet: true });
        const provider = LLMProviderFactory.getProvider()
        const isOk = await provider.testConnection()

        if (!isOk) {
            Logger.error(`Provider is not reachable. Please check your configuration file.`);
            throw new Error("Provider unreachable")
        }

        Logger.info('✅ Model provider is ready!')
    }
}