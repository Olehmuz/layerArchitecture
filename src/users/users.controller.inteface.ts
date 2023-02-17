import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';

export interface IUserController extends BaseController {
	login(req: Request, res: Response, next: NextFunction): void;
	repository(req: Request, res: Response, next: NextFunction): void;
}
