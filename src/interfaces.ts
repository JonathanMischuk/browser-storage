export interface BrowserStorageInterface {
	type?: string;
	name?: string;
}

export interface ApiSetOptionsInterface {
	data: object;
	expiryLength?: number;
	expiryFormat?: string;
}

export interface IsExpiredInterface {
	expiryFormat: string;
	expiryLength: number;
	createdAt: number;
}

export interface ProtoInterface {
	type: string;
	name: string;
}
