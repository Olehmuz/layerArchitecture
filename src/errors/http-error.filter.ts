export class HTTPError extends Error {
	constructor(public message: string, public code: number, public context?: string) {
		super(message);
	}
}
