import type {
	ErrorResponse,
	Meta,
	PaginatedResponse,
	SuccessResponse,
} from "./response.types";

export function successResponse<T>(
	data: T,
	code: number = 200,
	status: string = "OK",
	message = "Success",
): SuccessResponse<T> {
	return {
		success: true,
		code,
		status,
		message,
		data,
	};
}

export function paginatedResponse<T>(
	data: T[],
	pagination: Meta,
	code: number = 200,
	status: string = "OK",
	message = "Success",
): PaginatedResponse<T> {
	return {
		success: true,
		code,
		status,
		message,
		data,
		meta: pagination,
	};
}

export function errorResponse(
	code: number,
	status: string,
	message: string,
	error?: unknown,
): ErrorResponse {
	return {
		success: false,
		statusCode: code,
		errorCode: status,
		message,
		error,
	};
}
