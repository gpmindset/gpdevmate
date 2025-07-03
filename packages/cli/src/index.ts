import { Command } from "commander"

const program = new Command()

program
    .name("gpdevmate")
    .description("GPdevmate is a AI-powered code review agent")
    .version("0.0.1")

program
    .command("review")
    .argument('<path>', "Path to the project directory")
    .option("-o, --output <format>", "Output format (json or markdown)", "json")
    .action(async (path, options) => {
        console.log(path, options)
    })