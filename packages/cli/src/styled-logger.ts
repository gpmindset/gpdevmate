import { ILogger } from "@gpdevmate/core"
import chalk from "chalk";

export class StyledLogger implements ILogger  {
    info(message: string): void {
        console.log(chalk.blueBright('ℹ️ Info: '), chalk.white(message));
    }

    warn(message: string): void {
        console.warn(chalk.yellow('⚠️ Warn: '), chalk.yellowBright(message));
    }

    error(message: string): void {
        console.error(chalk.red('❌ Error: '), chalk.redBright(message));
    }

    debug(message: string) {
        console.debug(chalk.cyan('🛠️ Debug: '), chalk.cyanBright(message))
    }
}