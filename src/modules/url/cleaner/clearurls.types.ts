export interface ClearUrlsCatalog {
	providers: Record<string, ClearUrlsProvider>;
}

export interface ClearUrlsProvider {
	urlPattern: string;
	completeProvider: boolean;

	rules?: string[];
	rawRules?: string[];
	referralMarketing?: string[];
	exceptions?: string[];

	redirections?: string[];
	forceRedirection?: boolean;
}

export interface RemovedUrl {
	type: RemovedUrlType;
	parameter?: string;
	value?: string;
	rule: string;
	provider: string;
}

export enum RemovedUrlType {
	RULE = "RULE",
	RAW_RULE = "RAW-RULE",
	REFERRAL_MARKETING = "REFERRAL-MARKETING",
}
