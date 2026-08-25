export interface SuccessResponse<T> {
	success: true;
	code: number;
	status: string;
	message: string;
	data: T;
}

export interface PaginatedResponse<T> {
	success: true;
	code: number;
	status: string;
	message: string;
	data: T[];
	meta: Meta;
}

export interface Meta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface ErrorResponse {
	success: false;
	statusCode: number;
	errorCode: string;
	message: string;
	error?: unknown;
}

export type ApiResponse<T> =
	| SuccessResponse<T>
	| PaginatedResponse<T>
	| ErrorResponse;
