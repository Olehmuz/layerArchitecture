import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { IException } from './exception.filter.interface';
import { ILogger } from '../logger/logger.interface';

import { TYPES } from '../types';
import { HTTPError } from './http-error.filter';

@injectable()
export class ExceptionFilter implements IException {
	constructor(@inject(TYPES.ILogger) private logger: ILogger) {}
	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void {
		if (err instanceof HTTPError) {
			this.logger.error(`Exception with code: ${err.code}, message: ${err.message}`);
			res.status(err.code).send({
				err: err.message,
			});
		} else {
			this.logger.error(err.message);
			res.status(500).send({
				err: err.message,
			});
		}
	}
}
