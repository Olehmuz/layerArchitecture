import { injectable } from 'inversify';
import { Logger } from 'tslog';

import { ILogObj } from 'tslog/dist/types/interfaces';

@injectable()
export class LoggerService {
	private logger: Logger<ILogObj>;

	constructor() {
		this.logger = new Logger({ type: 'pretty', hideLogPositionForProduction: true });
	}

	public log(...args: unknown[]): void {
		this.logger.info(...args);
	}
	public error(...args: unknown[]): void {
		this.logger.error(...args);
	}
	public warn(...args: unknown[]): void {
		this.logger.warn(...args);
	}
}
