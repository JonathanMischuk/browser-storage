export interface BrowserStorage {
	type?: string;
	name?: string;
}

export interface ApiSetOptions {
	data?: object;
}

export interface IsExpired {
	expiryFormat: string;
	expiryLength: number;
	createdAt: number;
}
