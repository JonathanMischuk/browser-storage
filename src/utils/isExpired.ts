const timeFormats = {
	seconds: 1000,
	minutes: 60000,
	hours: 3600000,
	days: 86400000
};

interface IsExpired {
	expiryFormat: string;
	expiryLength: number;
	createdAt: number;
}

export const isExpired = ({
	expiryFormat,
	expiryLength,
	createdAt
}: IsExpired): boolean => {
	const currentTime = new Date().getTime();
	const timeToAdd = timeFormats[expiryFormat] * expiryLength;
	const expiryTime = createdAt + timeToAdd;

	return currentTime > expiryTime;
};
