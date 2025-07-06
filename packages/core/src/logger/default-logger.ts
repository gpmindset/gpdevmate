import { ILogger } from "../interfaces";

export class DefaultLogger implements ILogger{
    info(message: string): void {
        console.log(message);
    }

    warn(message: string): void {
        console.warn(message);
    }

    error(message: string): void {
        console.error(message);
    }

    debug(message: string) {
        console.debug(message);
    }
}