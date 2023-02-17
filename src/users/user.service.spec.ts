import 'reflect-metadata';
import { Container } from 'inversify';
import { UserModel } from '@prisma/client';

import { IConfigService } from '../config/config.service.inteface';
import { IUserRepository } from './users.repository.interface';
import { IUserService } from './users.service.inteface';

import { TYPES } from '../types';
import { UserService } from './users.service';
import { User } from './user.entity';

const container = new Container();

const userRepositoryMock: IUserRepository = {
	create: jest.fn(),
	find: jest.fn(),
};

const configServiceMock: IConfigService = {
	get: jest.fn(),
};

let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
	container.bind<IUserService>(TYPES.IUserService).to(UserService);
	container.bind<IConfigService>(TYPES.IConfigService).toConstantValue(configServiceMock);
	container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(userRepositoryMock);

	configService = container.get<IConfigService>(TYPES.IConfigService);
	userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
	userService = container.get<IUserService>(TYPES.IUserService);
});

enum MockData {
	PASSWORD = '1',
	EMAIL = 'olehmuz87@gmail.com',
	NAME = 'oleh',
}
let createdUser: UserModel | null;
describe('User service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValue(MockData.PASSWORD);
		userRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				email: user.email,
				name: user.name,
				password: user.password,
				id: 1,
			}),
		);

		createdUser = await userService.createUser({
			email: MockData.EMAIL,
			name: MockData.NAME,
			password: MockData.PASSWORD,
		});

		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual(MockData.PASSWORD);
	});

	it('Validate user - success', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const res = await userService.validateUser({
			email: MockData.EMAIL,
			password: MockData.PASSWORD,
		});

		expect(res).toBeTruthy();
	});

	it('Validate user - unsuccess', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(null);

		const res = await userService.validateUser({
			email: MockData.EMAIL,
			password: MockData.PASSWORD,
		});

		expect(res).toBeFalsy();
	});

	it('Validate user wrong password - unsuccess', async () => {
		userRepository.find = jest.fn().mockReturnValueOnce(createdUser);

		const res = await userService.validateUser({
			email: MockData.EMAIL,
			password: '2',
		});

		expect(res).toBeFalsy();
	});
});
