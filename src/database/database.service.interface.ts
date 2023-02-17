import { PrismaClient } from '@prisma/client';

export interface IDatabaseService {
	client: PrismaClient;
	connectDB(): Promise<void>;
	disconnectDB(): Promise<void>;
}
