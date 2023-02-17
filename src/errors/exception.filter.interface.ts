import { NextFunction, Request, Response } from 'express';

import { HTTPError } from './http-error.filter';

export interface IException {
	catch(err: Error | HTTPError, req: Request, res: Response, next: NextFunction): void;
}
