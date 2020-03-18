import { arrayHasValue } from './utils/index';
import { proto } from './proto';
import { privateProps } from './props';
import { STORAGE_TYPE_NAMES } from './constants';
import { BrowserStorageInterface } from './interfaces';

export const browserStorage = (customOptions: BrowserStorageInterface = {}) => {
	const props = {
		...privateProps,
		...customOptions
	};

	props.type =
		customOptions.type &&
		arrayHasValue(STORAGE_TYPE_NAMES, customOptions.type)
			? customOptions.type
			: privateProps.type;

	return Object.create(proto(props));
};
