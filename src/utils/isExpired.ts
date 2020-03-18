import { IsExpiredInterface } from '../interfaces';

const timeFormats = {
	seconds: 1000,
	minutes: 60000,
	hours: 3600000,
	days: 86400000
};

export const isExpired = ({
	expiryFormat,
	expiryLength,
	createdAt
}: IsExpiredInterface): boolean => {
	const currentTime = new Date().getTime();
	const timeToAdd = timeFormats[expiryFormat] * expiryLength;
	const expiryTime = createdAt + timeToAdd;

	return currentTime > expiryTime;
};
