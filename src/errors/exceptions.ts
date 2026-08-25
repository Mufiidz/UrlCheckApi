import { HttpException } from "./http-exception";

export class NotFoundException extends HttpException {
	constructor(message = "Not Found") {
		super(404, "NOT_FOUND", message);
	}
}

export class InternalServerErrorException extends HttpException {
	constructor(message = "Internal Server Error", options?: ErrorOptions) {
		super(500, "INTERNAL_SERVER_ERROR", message, options);
	}
}

export class BadRequestException extends HttpException {
	constructor(message = "Bad Request", options?: ErrorOptions) {
		super(400, "BAD_REQUEST", message, options);
	}
}
