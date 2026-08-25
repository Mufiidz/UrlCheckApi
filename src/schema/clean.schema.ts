import * as v from "valibot";

export const CleanUrlBody = v.object({
	url: v.pipe(
		v.string(),
		v.nonEmpty("url cant be empty"),
		v.url(),
		v.description("A url to clean must be provided and must be a valid url"),
	),
});

export const CleanUrlResponse = v.object({
	originalUrl: v.string(),
	cleanedUrl: v.string(),
	removed: v.array(
		v.object({
			type: v.string(),
			parameter: v.optional(v.string()),
			value: v.optional(v.string()),
			rule: v.string(),
			provider: v.string(),
		}),
	),
});
