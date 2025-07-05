import { Command } from "commander"
import { CodeReviewAgent } from "@gpdevmate/core"
import {ConfigWizard} from "./config-wizard";

const program = new Command()

program
    .name("gpdevmate")
    .description("GPdevmate is a AI-powered code review agent")
    .version("1.0.0")

program
    .command("review")
    .argument("<target>", "Path to the directory")
    .option("--mode <mode>", "LLM Mode: openai | local | api", "openai")
    .option('--limit <number>', 'Max number of files to review', '5')
    .option('--skip-dirs <dirs>', 'Comma-separated list of directories to skip', val => val.split(','), [])
    .option("--dry-run", "Show which files are going to be reviewed")
    .action(async (target, options) => {
        const agent = new CodeReviewAgent({
            path: target,
            mode: options.mode,
            maxFiles: parseInt(options.limit),
            dryRun: options.dryRun,
            skipDirs: new Set(options.skipDirs),
            maxFileSizeBytes: 200 * 1024
        })

        await agent.execute()
    })


program
    .command("config")
    .requiredOption("--mode <mode>", "LLM Mode: openai | local | api")
    .action(async (options) => {
        await ConfigWizard.run(options.mode)
    })

program.parse()




