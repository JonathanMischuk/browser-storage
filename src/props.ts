import { LOCAL_STORAGE, DAYS } from './constants';

export const privateProps = {
	type: LOCAL_STORAGE,
	name: ''
};

export const itemProps = {
	data: {},
	createdAt: null,
	expiryFormat: DAYS,
	expiryLength: 365
};
