import request from 'supertest';

import { App } from '../app';
import { boot } from '../main';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Registration - error', async () => {
		const res = await request(application.app).post('/users/registry').send({
			email: 'olehmuz8722223@gmail.com',
			name: 'Oleh',
			password: 'password',
		});
		expect(res.statusCode).toEqual(422);
	});

	it('Login - success', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'olehmuz8722223@gmail.com',
			password: 'password',
		});
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - error', async () => {
		const res = await request(application.app).post('/users/login').send({
			email: 'olehmuz8722223@gmail.com',
			password: 'password1',
		});
		expect(res.statusCode).toBe(401);
	});

	it('Info - success', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'olehmuz8722223@gmail.com',
			password: 'password',
		});
		const res = await request(application.app)
			.post('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe('olehmuz8722223@gmail.com');
	});

	it('Info - error', async () => {
		const login = await request(application.app).post('/users/login').send({
			email: 'olehmuz8722223@gmail.com',
			password: 'password',
		});
		const res = await request(application.app)
			.post('/users/info')
			.set('Authorization', `Bearer ${login.body.jwt}1`);
		expect(res.statusCode).toEqual(422);
	});
});

afterAll(() => {
	application.close();
});
