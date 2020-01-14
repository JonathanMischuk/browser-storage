import { arrayHasValue } from '../utils';

const { localStorage, sessionStorage } = window;
const { stringify, parse } = JSON;

const LOCAL_STORAGE = 'localStorage';
const SESSION_STORAGE = 'sessionStorage';
const BROWSER_STORAGE_NAMES = 'browserStorageNames';

const SECONDS = 'seconds';
const MINUTES = 'minutes';
const HOURS = 'hours';
const DAYS = 'days';

const storageTypeNames = [LOCAL_STORAGE, SESSION_STORAGE];
const storageTypeObjects = { localStorage, sessionStorage };

const privateProps = {
	type: LOCAL_STORAGE,
	name: ''
};

const itemProps = {
	data: {},
	createdAt: null,
	expiryFormat: DAYS,
	expiryLength: 365
};

const timeFormats = {
	seconds: 1000,
	minutes: 60000,
	hours: 3600000,
	days: 86400000
};

const isExpired = ({ expiryFormat, expiryLength, createdAt }) => {
	const currentTime = new Date().getTime();
	const timeToAdd = timeFormats[expiryFormat] * expiryLength;
	const expiryTime = createdAt + timeToAdd;

	return currentTime > expiryTime;
};

const proto = props => {
	const storage = storageTypeObjects[props.type];
	const get = name => parse(storage.getItem(name));
	const storageNames = get(BROWSER_STORAGE_NAMES);
	const storageName = props.name;
	const storageItemNames = get(storageName);

	const events = {};

	const api = {
		set(name, options = {}) {
			const { data } = options;

			if (name === undefined) throw Error('name cannot be undefined');
			if (data === undefined) throw Error('data cannot be undefined');

			const storageItemNames = get(storageName);
			if (!storageItemNames.includes(name)) {
				storage.setItem(
					storageName,
					stringify([...storageItemNames, name])
				);
			}

			const createdAt = new Date().getTime();
			storage.setItem(
				name,
				stringify({ ...itemProps, ...options, createdAt })
			);

			if (events.hasOwnProperty(name)) {
				events[name].forEach(event => event(data));
			}

			return api;
		},

		get(name) {
			if (name === undefined) throw Error('name cannot be undefined');

			const storageItem = get(name);

			if (storageItem) {
				if (isExpired(storageItem)) {
					api.remove(name);
					return null;
				}

				return storageItem.data;
			}

			return null;
		},

		remove(name) {
			if (name === undefined) throw Error('name cannot be undefined');
			if (api.exists(name)) {
				const newStorageItemNames = get(storageName).filter(
					storageItemName => storageItemName !== name
				);

				storage.removeItem(name);
				storage.setItem(storageName, stringify(newStorageItemNames));

				// what to do if storage is cleared but on event still exists
				// if (events.hasOwnProperty(name)) delete events[name];
			}

			return api;
		},

		exists(name) {
			if (name === undefined) throw Error('name cannot be undefined');
			return get(name) !== null;
		},

		clear() {
			const storageItemNames = get(storageName);

			storageItemNames.forEach(name => {
				api.remove(name);
			});

			return api;
		},

		items() {
			return get(storageName);
		},

		on(name, cb) {
			if (get(storageName).includes(name)) {
				if (!events.hasOwnProperty(name)) events[name] = [];
				events[name] = [...events[name], cb];
			}
		}
	};

	if (!storageNames || !storageNames.includes(storageName)) {
		storage.setItem(
			BROWSER_STORAGE_NAMES,
			stringify(
				storageNames ? [...storageNames, storageName] : [storageName]
			)
		);
	}

	if (!storageItemNames) {
		storage.setItem(storageName, stringify([]));
	} else {
		storageItemNames.forEach(name => {
			const storageItem = get(name);

			if (isExpired(storageItem)) {
				api.remove(name);
			}
		});
	}

	return api;
};

export const browserStorage = (customOptions = {}) => {
	const props = {
		...privateProps,
		...customOptions
	};

	props.type =
		customOptions.type &&
		arrayHasValue(storageTypeNames, customOptions.type)
			? customOptions.type
			: privateProps.type;

	return Object.assign(Object.create(proto(props)));
};
