import 'reflect-metadata';
import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { json } from 'body-parser';

import { ILogger } from './logger/logger.interface';
import { IUserController } from './users/users.controller.inteface';
import { IException } from './errors/exception.filter.interface';
import { IDatabaseService } from './database/database.service.interface';
import { IConfigService } from './config/config.service.inteface';

import { TYPES } from './types';
import { AuthMiddleware } from './common/auth.middleware';

@injectable()
export class App {
	public app: Express;
	private port = 8000;
	private server: Server;

	constructor(
		@inject(TYPES.ILogger) private logger: ILogger,
		@inject(TYPES.IUserController) private usersController: IUserController,
		@inject(TYPES.IExceptionFilter) private exceptionFilter: IException,
		@inject(TYPES.IDatabaseService) private databaseService: IDatabaseService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		this.app = express();
		this.server = this.app.listen(this.port, () => {
			this.logger.log('Server started');
		});
	}
	private useMiddleware(): void {
		this.app.use(json());
		const auth = new AuthMiddleware(this.configService.get('SECRET'));
		this.app.use(auth.execute.bind(auth));
	}
	private useRoutes(routePath: string): void {
		this.app.use(routePath, this.usersController.router);
	}
	private useExceptionFilter(): void {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}
	public async init(): Promise<void> {
		this.databaseService.connectDB();
		this.useMiddleware();
		this.useRoutes('/users');
		this.useExceptionFilter();
	}

	public close(): void {
		this.server.close();
	}
}
