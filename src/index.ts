import openapi from "@elysia/openapi";
import { toJsonSchema } from "@valibot/to-json-schema";
import { Elysia } from "elysia";
import * as v from "valibot";

import { errorResponsePlugin } from "./plugins/errorResponsePlugin";
import { responsePlugin } from "./plugins/responsePlugin";
import { v1Routes } from "./routes/v1";
import { ApiDocsSuccessResponse } from "./schema/response.schema";
import { SuccessResult } from "./shared/result";

const app = new Elysia()
	.use(
		openapi({
			path: "/docs",
			exclude: {
				paths: ["/", "/v1/", "/v1/docs"],
			},
			mapJsonSchema: {
				valibot: toJsonSchema,
			},
			documentation: {
				info: {
					title: "URL Checker",
					version: "1.0.0",
					description: "URL Checker API Documentation",
				},
				tags: [
					{
						name: "App",
						description: "General Endpoints",
					},
					{
						name: "Clean",
						description: "URL Clean Endpoints",
					},
				],
			},
		}),
	)
	.use(errorResponsePlugin)
	.use(responsePlugin)
	.use(v1Routes)
	.get("/", ({ redirect }) => redirect("/docs"))
	.get(
		"/health",
		() =>
			new SuccessResult({
				lastUpdate: new Date(2026, 7, 24, 13, 0, 0).toISOString(),
			}),
		{
			response: {
				200: ApiDocsSuccessResponse(v.object({ lastUpdate: v.string() })),
			},
			detail: {
				description: "Health Check",
				tags: ["App"],
			},
		},
	);

export default app;

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
