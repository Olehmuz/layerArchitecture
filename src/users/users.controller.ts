import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

import { ILogger } from '../logger/logger.interface';
import { IUserService } from './users.service.inteface';
import { IConfigService } from '../config/config.service.inteface';

import { BaseController } from '../common/base.controller';
import { HTTPError } from '../errors/http-error.filter';
import { TYPES } from '../types';

import { UsersLoginDTO } from './dto/user-login.dto';
import { UsersRegistryDTO } from './dto/user-regisrty.dto';

import { ValidatorMiddleware } from '../common/validator.middleware';
import { GuardMiddleware } from '../common/auth.guard';

@injectable()
export class UsersController extends BaseController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.IUserService) private userService: IUserService,
		@inject(TYPES.IConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/login',
				func: this.login,
				method: 'post',
				middlewares: [new ValidatorMiddleware(UsersLoginDTO)],
			},
			{
				path: '/registry',
				func: this.registry,
				method: 'post',
				middlewares: [new ValidatorMiddleware(UsersRegistryDTO)],
			},
			{
				path: '/info',
				func: this.info,
				method: 'post',
				middlewares: [new GuardMiddleware()],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UsersLoginDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		if (!(await this.userService.validateUser(req.body))) {
			return next(new HTTPError('Login error', 401));
		}
		const jwt = await this.signJWT(req.body.email);
		this.ok(res, { jwt });
	}

	async info(
		{ user }: Request<{}, {}, UsersLoginDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const authorizedUserInfo = await this.userService.getUser(user);
		this.ok(res, authorizedUserInfo);
	}

	async registry(
		{ body }: Request<{}, {}, UsersRegistryDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HTTPError('User is already exist', 422));
		}
		this.ok(res, result);
	}

	private async signJWT(email: string): Promise<string> {
		return new Promise<string>((res, rej) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				this.configService.get('SECRET'),
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						rej(err);
					}
					res(token);
				},
			);
		});
	}
}
