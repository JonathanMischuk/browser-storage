import { arrayHasValue } from './utils/index';
import { proto } from './proto';
import { privateProps } from './props';
import { STORAGE_TYPE_NAMES } from './constants';
import { BrowserStorage } from './interfaces';

export const browserStorage = (customOptions: BrowserStorage = {}) => {
	const _props = {
		...privateProps,
		...customOptions
	};

	_props.type =
		customOptions.type &&
		arrayHasValue(STORAGE_TYPE_NAMES, customOptions.type)
			? customOptions.type
			: privateProps.type;

	return Object.create(proto(_props));
};
