import { arrayHasValue, isExpired } from './utils/index';

const { localStorage, sessionStorage } = window;
const { stringify, parse } = JSON;

const LOCAL_STORAGE: string = 'localStorage';
const SESSION_STORAGE: string = 'sessionStorage';
const BROWSER_STORAGE_NAMES: string = 'browserStorageNames';

const DAYS: string = 'days';

const storageTypeNames: string[] = [LOCAL_STORAGE, SESSION_STORAGE];
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

interface ApiSetOptions {
	data?: object;
}

const proto = props => {
	const storage = storageTypeObjects[props.type];
	const get = name => parse(storage.getItem(name));
	const storageNames = get(BROWSER_STORAGE_NAMES);
	const storageName = props.name;
	const storageItemNames = get(storageName);

	const events = {};

	const api = {
		set(name: string, options: ApiSetOptions = {}) {
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

		on(name: string, cb: () => void): void {
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

interface BrowserStorage {
	type?: string;
	name?: string;
}

export const browserStorage = (customOptions: BrowserStorage = {}) => {
	const props = {
		...privateProps,
		...customOptions
	};

	props.type =
		customOptions.type &&
		arrayHasValue(storageTypeNames, customOptions.type)
			? customOptions.type
			: privateProps.type;

	return Object.create(proto(props));
};
