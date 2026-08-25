import type Elysia from "elysia";

import { HttpException } from "@/errors/http-exception";
import { errorResponse } from "@/shared/response";

export const errorResponsePlugin = (app: Elysia) =>
	app.error({ HttpException }).onError(({ code, error, set, path }) => {
		switch (code) {
			case "HttpException":
				set.status = error.statusCode;
				return errorResponse(
					error.statusCode,
					error.errorCode,
					error.message,
					error.cause,
				);
			case "VALIDATION": {
				set.status = error.status;
				const errors = error.all.map((e) => {
					try {
						return e.message.split("type:")[1].trim();
					} catch (_error) {
						return e.message;
					}
				});
				const errorMessage = errors[0];
				return errorResponse(
					set.status,
					`${code}_ERROR`,
					errorMessage,
					error.all,
				);
			}
			case "NOT_FOUND":
				set.status = 404;
				return errorResponse(set.status, code, `${path} Not Found`);
			default:
				set.status = 500;
				return errorResponse(
					set.status,
					code.toLocaleString(),
					"Internal Server Error",
					getErrorCause(error),
				);
		}
	});

function getErrorCause(error: unknown): unknown {
	if (error instanceof Error) {
		return error.cause;
	}

	return undefined;
}
