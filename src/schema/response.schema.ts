import * as v from "valibot";

export const ApiDocsResponse = <T extends v.GenericSchema>(data: T) => ({
	200: ApiDocsSuccessResponse(data),
	404: ApiDocsErrorResponse(),
	400: ApiDocsErrorResponse(),
	422: ApiDocsErrorResponse(),
	500: ApiDocsErrorResponse(),
});

export const ApiDocsSuccessResponse = <T extends v.GenericSchema>(data: T) =>
	v.object({
		success: v.boolean(),
		code: v.number(),
		status: v.string(),
		message: v.string(),
		data: data,
	});

export const ApiDocsErrorResponse = () =>
	v.object({
		success: v.boolean(),
		statusCode: v.number(),
		errorCode: v.string(),
		message: v.string(),
		error: v.any(),
	});
