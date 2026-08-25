import type Elysia from "elysia";

import { UrlCheckService } from "@/modules/url/urlcheck.service";
import { CleanUrlBody, CleanUrlResponse } from "@/schema/clean.schema";
import { ApiDocsResponse } from "@/schema/response.schema";

const urlCheckService = new UrlCheckService();

export const v1Routes = (app: Elysia) =>
	app.group("/v1", (app) =>
		app
			.get("/", ({ redirect }) => redirect("/docs"))
			.get("/docs", ({ redirect }) => redirect("/docs"))
			.post("/clean", ({ body: { url } }) => urlCheckService.check(url), {
				body: CleanUrlBody,
				response: ApiDocsResponse(CleanUrlResponse),
				detail: {
					description: "Clean and normalize URL.",
					tags: ["Clean"],
				},
			}),
	);
