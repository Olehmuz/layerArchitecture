import { IsEmail, IsString } from 'class-validator';

export class UsersRegistryDTO {
	@IsEmail({}, { message: 'Email is not valid.' })
	email: string;

	@IsString({ message: 'Name is not valid.' })
	name: string;

	@IsString({ message: 'Password is not valid.' })
	password: string;
}
