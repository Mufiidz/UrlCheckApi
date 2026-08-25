import { BadRequestException } from "@/errors/exceptions";
import { SuccessResult } from "@/shared/result";
import { cleanUrl } from "./cleaner/clean_urls";

export class UrlCheckService {
	async check(rawUrl: string) {
		const url = this.parseUrl(rawUrl);

		if (!["http:", "https:"].includes(url.protocol)) {
			throw new BadRequestException("Only HTTP and HTTPS URLs are supported", {
				cause: { value: url },
			});
		}

		return new SuccessResult(await cleanUrl(url.toString()));
	}

	private parseUrl(value: string): URL {
		try {
			return new URL(value);
		} catch (_error) {
			throw new BadRequestException("Invalid URL");
		}
	}
}
