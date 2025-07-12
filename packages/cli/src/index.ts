#!/usr/bin/env node

import { Command } from "commander"
import { CodeReviewAgent, setLogger } from "@gpdevmate/core"
import {ConfigWizard} from "./config-wizard";
import chalk from "chalk";
import {ReviewReport} from "./review-report";
import {StyledLogger} from "./styled-logger";
import { config } from "@dotenvx/dotenvx"
import {CheckConnection} from "./check-connection";

setLogger(new StyledLogger())

const program = new Command()

program
    .name("gpdevmate")
    .description("GPdevmate is a AI-powered code review agent")
    .version("1.0.0")

program
    .command("review")
    .argument("<target>", "Path to the directory")
    .option("--provider <provider>", "LLM Provider: openai | ollama", "openai")
    .option('--limit <number>', 'Max number of files to review', '5')
    .option('--skip-dirs <dirs>', 'Comma-separated list of directories to skip', val => val.split(','), [])
    .option("--dry-run", "Show which files are going to be reviewed")
    .option("--of, --output-format <output_format>", "Output format: console | markdown", "console")
    .option("-o, --output <output>", "Output directory: to save the review as .md file")
    .action(async (target, options) => {

        const isEnvExists = ConfigWizard.isEnvExists()

        if (!isEnvExists) {
            await ConfigWizard.run(options.provider)
        }

        config({ path: ConfigWizard.getConfigPath(), quiet: true })

        const agent = new CodeReviewAgent({
            path: target,
            provider: options.provider,
            maxFiles: parseInt(options.limit),
            skipDirs: new Set(options.skipDirs),
            maxFileSizeBytes: 200 * 1024,
        })

        if (options.dryRun) {
            const filesToReview = await agent.dryRun()
            console.log(chalk.bold.cyan('\n📂\u0020\u0020Files to Review:\n'));

            filesToReview.forEach((file) => {
                console.log(chalk.green('•'), chalk.white(file));
            });

            return
        }

        const review = await agent.getReview()

        const reviewReport = new ReviewReport()
        reviewReport.setMarkdownText(review!)

        switch (options.outputFormat){
            case "console":
                reviewReport.reportInConsole()
                break;
            case "markdown":
                reviewReport.writeToMarkdown(options.output ? options.output : target)
                break;
        }
    })


program
    .command("config")
    .description("To set model provider and its config")
    .option("--provider <provider>", "Set default LLM Provider: openai | ollama")
    .option("--update", "To update provider configs")
    .action(async function (options) {
        if (!options.provider && options.update) { // Update provider and its config
            const provider = await ConfigWizard.pickProvider()
            if (provider) {
                await ConfigWizard.run(provider)
            }
            return;
        } else if (options.provider && !options.update)  { // Update provider only
            await ConfigWizard.setProvider(options.provider)
        } else if (options.provider && options.update) { // Update specific provider config
            await ConfigWizard.run(options.provider)
        } else {
            this.help()
        }
    })

program
    .command("check")
    .description("To check whether provider is reachable")
    .action(async function (options) {
        await CheckConnection.checkProvider()
    })


program.parse()




