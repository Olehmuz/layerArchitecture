import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';
import { IDatabaseService } from './database.service.interface';

@injectable()
export class DatabaseService implements IDatabaseService {
	public client: PrismaClient;
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {
		const prisma = new PrismaClient();
		this.client = prisma;
	}

	async connectDB(): Promise<void> {
		try {
			await this.client.$connect();
			this.logger.log(`[Database service] client is connected.`);
		} catch (e) {
			if (e instanceof Error) {
				this.logger.log(`[Database service] client isn't connected. Error: ${e.message}`);
			}
		}
	}

	async disconnectDB(): Promise<void> {
		await this.client.$disconnect();
		this.logger.log(`[Database service] client is disconnected.`);
	}
}
