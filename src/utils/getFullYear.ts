export const getFullYear = (): number => {
	const date = new Date();

	return date.getFullYear() + 1;
};
