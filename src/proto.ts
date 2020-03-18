import { isExpired } from './utils/index';
import { itemProps } from './props';
import { ProtoInterface, ApiSetOptionsInterface } from './interfaces';
import { BROWSER_STORAGE_NAMES, STORAGE_TYPE_OBJECTS } from './constants';

const { stringify, parse } = JSON;

export const proto = (props: ProtoInterface) => {
	const storage = STORAGE_TYPE_OBJECTS[props.type];
	const get = (name: string) => parse(storage.getItem(name));
	const storageNames: string = get(BROWSER_STORAGE_NAMES);
	const storageName: string = props.name;
	const storageItemNames: string[] = get(storageName);

	const events = {};

	const api = {
		set(name: string, options: ApiSetOptionsInterface) {
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

		get(name: string) {
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

		remove(name: string) {
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

		exists(name: string) {
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

		on(name: string, cb: (value: any) => void): void {
			if (get(storageName).includes(name)) {
				if (!events.hasOwnProperty(name)) events[name] = [];
				events[name] = [...events[name], cb];
			}
		}
	};

	// set local storage with list of browserStorage
	// instance names for persistence
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

	console.log(api);

	return api;
};
