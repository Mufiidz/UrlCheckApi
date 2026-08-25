import type { Meta } from "./response.types";

export class SuccessResult<T> {
	public readonly success: true = true;
	constructor(
		public readonly data: T,
		public readonly code: number = 200,
		public readonly status = "OK",
		public readonly message = "Success",
	) {}
}

export class PaginatedResult<T> {
	public readonly success: true = true;
	constructor(
		public readonly data: T[],
		readonly meta: Meta,
		public readonly code: number = 200,
		public readonly status = "OK",
		public readonly message = "Success",
	) {}
}
