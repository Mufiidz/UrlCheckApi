import type Elysia from "elysia";

import { paginatedResponse, successResponse } from "../shared/response";
import { PaginatedResult, SuccessResult } from "../shared/result";

export const responsePlugin = (app: Elysia) =>
	app.onAfterHandle(({ responseValue }) => {
		if (responseValue instanceof Response) {
			return responseValue;
		}

		if (responseValue instanceof SuccessResult) {
			return successResponse(
				responseValue.data,
				responseValue.code,
				responseValue.status,
				responseValue.message,
			);
		}

		if (responseValue instanceof PaginatedResult) {
			return paginatedResponse(
				responseValue.data,
				responseValue.meta,
				responseValue.code,
				responseValue.status,
				responseValue.message,
			);
		}

		return successResponse(responseValue);
	});
