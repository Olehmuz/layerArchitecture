import 'reflect-metadata';
import { inject, injectable } from 'inversify';

import { UsersLoginDTO } from './dto/user-login.dto';
import { UsersRegistryDTO } from './dto/user-regisrty.dto';

import { User } from './user.entity';
import { TYPES } from '../types';
import { UserModel } from '@prisma/client';

import { IUserService } from './users.service.inteface';
import { IConfigService } from '../config/config.service.inteface';
import { IUserRepository } from './users.repository.interface';

@injectable()
export class UserService implements IUserService {
	@inject(TYPES.IConfigService) private configService: IConfigService;
	@inject(TYPES.IUserRepository) private userRepository: IUserRepository;
	async createUser({ email, name, password }: UsersRegistryDTO): Promise<UserModel | null> {
		const isExist = await this.userRepository.find(email);
		if (isExist) {
			return null;
		}
		const newUser = new User(name, email);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));

		return await this.userRepository.create(newUser);
	}
	async validateUser(dto: UsersLoginDTO): Promise<boolean> {
		const existingUser = await this.userRepository.find(dto.email);
		if (!existingUser) {
			return false;
		}
		const user = new User(existingUser.name, existingUser.email, existingUser.password);
		return await user.comparePassword(dto.password);
	}

	async getUser(userEmail: string): Promise<UserModel | null> {
		const isExistUser = this.userRepository.find(userEmail);
		return isExistUser;
	}
}
