import { IMiddleware } from './middleware.inteface';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export class AuthMiddleware implements IMiddleware {
	private secret: string;
	constructor(secret: string) {
		this.secret = secret;
	}
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			verify(req.headers.authorization.split(' ')[1], this.secret, (err, payload) => {
				if (err) {
					return next();
				} else if (typeof payload === 'object') {
					req.user = payload.email;
					return next();
				}
			});
		} else {
			return next();
		}
	}
}
