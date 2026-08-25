export class HttpException extends Error {
	constructor(
		public readonly statusCode: number,
		public readonly errorCode: string,
		public readonly message: string,
		options?: ErrorOptions,
	) {
		super(message, options);

		this.name = "HttpException";
	}
}
