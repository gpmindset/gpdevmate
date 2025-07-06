import { ILogger } from '../interfaces';
import { DefaultLogger } from './default-logger';

let logger: ILogger = new DefaultLogger();

export const Logger = {
    info: (msg: string) => logger.info(msg),
    warn: (msg: string) => logger.warn(msg),
    error: (msg: string) => logger.error(msg),
    debug: (msg: string) => logger.debug(msg),
};

export function setLogger(customLogger: ILogger): void {
    logger = customLogger;
}

export { DefaultLogger, ILogger }