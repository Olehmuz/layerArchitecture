import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { IUserRepository } from './users.repository.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IDatabaseService } from '../database/database.service.interface';
import { UsersRegistryDTO } from './dto/user-regisrty.dto';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.IDatabaseService) private databaseService: IDatabaseService) {
		console.log('213');
	}

	create({ email, name, password }: UsersRegistryDTO): Promise<UserModel> {
		return this.databaseService.client.userModel.create({
			data: {
				email,
				name,
				password,
			},
		});
	}
	find(email: string): Promise<UserModel> {
		return this.databaseService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
