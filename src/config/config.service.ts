import 'reflect-metadata';
import { config, DotenvConfigOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { TYPES } from '../types';

import { IConfigService } from './config.service.inteface';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvConfigOutput;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const result = config();
		if (result.error) {
			this.logger.error(`[Config service] ${result.error}`);
		} else {
			this.logger.log(`[Config service] .env file loaded.`);
			this.config = result.parsed;
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}
