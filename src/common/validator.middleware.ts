import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

import { IMiddleware } from './middleware.inteface';

export class ValidatorMiddleware implements IMiddleware {
	constructor(private classValidator: ClassConstructor<Object>) {}
	execute({ body }: Request, res: Response, next: NextFunction): void {
		const instance = plainToInstance(this.classValidator, body);
		validate(instance).then((errors) => {
			if (errors.length > 0) {
				res.status(422).send(errors);
			} else {
				next();
			}
		});
	}
}
