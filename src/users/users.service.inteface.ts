import { UsersLoginDTO } from './dto/user-login.dto';
import { UsersRegistryDTO } from './dto/user-regisrty.dto';
import { UserModel } from '@prisma/client';

export interface IUserService {
	createUser(dto: UsersRegistryDTO): Promise<UserModel | null>;
	validateUser(dto: UsersLoginDTO): Promise<boolean>;
	getUser(userEmail: string): Promise<UserModel | null>;
}
