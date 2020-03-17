const { localStorage, sessionStorage } = window;

export const LOCAL_STORAGE: string = 'localStorage';
export const SESSION_STORAGE: string = 'sessionStorage';
export const STORAGE_TYPE_NAMES: string[] = [LOCAL_STORAGE, SESSION_STORAGE];
export const BROWSER_STORAGE_NAMES: string = 'browserStorageNames';
export const DAYS: string = 'days';
export const STORAGE_TYPE_OBJECTS = { localStorage, sessionStorage };
