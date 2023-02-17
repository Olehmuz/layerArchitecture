import { UserModel } from '@prisma/client';
import { UsersRegistryDTO } from './dto/user-regisrty.dto';

export interface IUserRepository {
	create(dto: UsersRegistryDTO): Promise<UserModel>;
	find(email: string): Promise<UserModel | null>;
}
