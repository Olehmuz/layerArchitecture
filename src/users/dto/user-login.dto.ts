import { IsEmail, IsString } from 'class-validator';

export class UsersLoginDTO {
	@IsEmail({}, { message: 'Email is not valid.' })
	email: string;
	@IsString()
	password: string;
}
