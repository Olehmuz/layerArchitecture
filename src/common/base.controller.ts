import 'reflect-metadata';
import { Response, Router } from 'express';
import { injectable } from 'inversify';

import { ILogger } from '../logger/logger.interface';
import { ExpressResponseType, IControllerRoute } from './route.interface';

@injectable()
export class BaseController {
	private _router: Router;
	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	send<T>(res: Response, message: T, code: number): Response<any, Record<string, any>> {
		res.type('application/json');
		return res.status(code).send(message);
	}
	ok<T>(res: Response, message: T): ExpressResponseType {
		return this.send(res, message, 200);
	}

	bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			const handle = route.func.bind(this);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const pipeline = middleware ? [...middleware, handle] : handle;
			this._router[route.method](route.path, pipeline);
			this.logger.log(`[${route.method}] ${route.path}`);
		}
	}
}
