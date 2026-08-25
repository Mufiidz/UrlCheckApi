import { NotFoundException } from "../../../errors/exceptions";
import {
	type ClearUrlsCatalog,
	type RemovedUrl,
	RemovedUrlType,
} from "./clearurls.types";

let clearUrlsCatalog: ClearUrlsCatalog | null = null;

async function loadCatalog(): Promise<ClearUrlsCatalog> {
	if (clearUrlsCatalog) return clearUrlsCatalog;

	const file = Bun.file(`${process.cwd()}/src/data/data_clearurls.json`);
	const isFileExist = await file.exists();
	if (!isFileExist) {
		throw new NotFoundException("ClearURLs catalog file not Found");
	}

	try {
		clearUrlsCatalog = (await file.json()) as ClearUrlsCatalog;
		return clearUrlsCatalog;
	} catch (error) {
		throw new Error("Failed to load ClearURLs catalog", {
			cause: error,
		});
	}
}

export async function cleanUrl(rawUrl: string) {
	let cleanedUrl = rawUrl;
	const catalog = await loadCatalog();
	const removedParams: RemovedUrl[] = [];

	for (const [providerName, provider] of Object.entries(catalog.providers)) {
		// skip when url not match with provider
		if (!matches(provider.urlPattern, cleanedUrl)) continue;

		// Check if this URL is listed in exceptions
		const urlExceptions = provider.exceptions;
		const isInExceptions =
			urlExceptions?.some((urlException) =>
				matches(urlException, cleanedUrl),
			) ?? false;
		if (isInExceptions) continue;

		// remove if this url is listed in rules
		cleanedUrl = removeRules(
			cleanedUrl,
			RemovedUrlType.RULE,
			provider.rules,
			providerName,
			removedParams,
		);

		// remove if this url is listed in referralMarketing
		cleanedUrl = removeRules(
			cleanedUrl,
			RemovedUrlType.REFERRAL_MARKETING,
			provider.referralMarketing,
			providerName,
			removedParams,
		);

		// remove if this url is listed in rawRules
		cleanedUrl = removeRawRules(
			cleanedUrl,
			provider.rawRules,
			providerName,
			removedParams,
		);
	}
	return {
		originalUrl: rawUrl,
		cleanedUrl,
		removed: removedParams,
	};
}

function matches(pattern: string | undefined, value: string): boolean {
	if (!pattern) return false;

	try {
		const regex = RegExp(pattern, "i");
		return regex.test(value);
	} catch (error) {
		console.warn(`Invalid regex: ${pattern}`, error);
		return false;
	}
}

function removeRules(
	rawUrl: string,
	type: RemovedUrlType,
	rules: string[] | undefined,
	providerName: string,
	removed: RemovedUrl[],
): string {
	if (!rules?.length) return rawUrl;

	let url: URL;
	url = new URL(rawUrl);

	const parameters = [...url.searchParams.entries()];

	for (const [key, value] of parameters) {
		const matchedRule = rules.find((rule) => matches(`^(?:${rule})$`, key));
		if (!matchedRule) continue;

		url.searchParams.delete(key);

		removed.push({
			type,
			parameter: key,
			value,
			rule: matchedRule,
			provider: providerName,
		});
	}
	return url.toString();
}

function removeRawRules(
	rawUrl: string,
	rules: string[] | undefined,
	providerName: string,
	removed: RemovedUrl[],
): string {
	if (!rules?.length) return rawUrl;

	let currentUrl = rawUrl;
	for (const rule of rules) {
		if (!matches(rule, currentUrl)) continue;

		const match = currentUrl.match(new RegExp(rule, "i"));
		if (!match) continue;

		const cleanedUrl = currentUrl.replace(new RegExp(rule, "i"), "");

		if (cleanedUrl === currentUrl) continue;

		currentUrl = cleanedUrl;

		removed.push({
			type: RemovedUrlType.RAW_RULE,
			value: match[0],
			rule,
			provider: providerName,
		});
	}
	return currentUrl;
}
