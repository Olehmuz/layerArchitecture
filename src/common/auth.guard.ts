import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { HTTPError } from '../errors/http-error.filter';
import { IMiddleware } from './middleware.inteface';

export class GuardMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		} else {
			return next(new HTTPError('Not authorized user.', 422));
		}
	}
}
