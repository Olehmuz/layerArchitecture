import 'reflect-metadata';
import { Container, ContainerModule } from 'inversify';

import { App } from './app';
import { TYPES } from './types';
import { ExceptionFilter } from './errors/exception.filter';
import { UsersController } from './users/users.controller';

import { ILogger } from './logger/logger.interface';
import { IException } from './errors/exception.filter.interface';
import { IBootstrap } from './bootstrap.inteface';
import { IUserService } from './users/users.service.inteface';
import { IConfigService } from './config/config.service.inteface';
import { IDatabaseService } from './database/database.service.interface';
import { IUserRepository } from './users/users.repository.interface';

import { LoggerService } from './logger/logger';
import { UserService } from './users/users.service';
import { ConfigService } from './config/config.service';
import { DatabaseService } from './database/Database.service';
import { UserRepository } from './users/users.repository';
import { BaseController } from './common/base.controller';

const appBindings = new ContainerModule((bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<BaseController>(TYPES.IUserController).to(UsersController);
	bind<IException>(TYPES.IExceptionFilter).to(ExceptionFilter);
	bind<IUserService>(TYPES.IUserService).to(UserService);
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<IDatabaseService>(TYPES.IDatabaseService).to(DatabaseService).inSingletonScope();
	bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
	bind<App>(TYPES.App).to(App);
});

async function bootstrap(): Promise<IBootstrap> {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.App);
	await app.init();
	return { appContainer, app };
}

export const boot = bootstrap();
