"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var utils_1 = require("./utils");
var localStorage = window.localStorage, sessionStorage = window.sessionStorage;
var stringify = JSON.stringify, parse = JSON.parse;
var LOCAL_STORAGE = 'localStorage';
var SESSION_STORAGE = 'sessionStorage';
var BROWSER_STORAGE_NAMES = 'browserStorageNames';
var SECONDS = 'seconds';
var MINUTES = 'minutes';
var HOURS = 'hours';
var DAYS = 'days';
var storageTypeNames = [LOCAL_STORAGE, SESSION_STORAGE];
var storageTypeObjects = { localStorage: localStorage, sessionStorage: sessionStorage };
var privateProps = {
    type: LOCAL_STORAGE,
    name: ''
};
var itemProps = {
    data: {},
    createdAt: null,
    expiryFormat: DAYS,
    expiryLength: 365
};
var timeFormats = {
    seconds: 1000,
    minutes: 60000,
    hours: 3600000,
    days: 86400000
};
var isExpired = function (_a) {
    var expiryFormat = _a.expiryFormat, expiryLength = _a.expiryLength, createdAt = _a.createdAt;
    var currentTime = new Date().getTime();
    var timeToAdd = timeFormats[expiryFormat] * expiryLength;
    var expiryTime = createdAt + timeToAdd;
    return currentTime > expiryTime;
};
var proto = function (props) {
    var storage = storageTypeObjects[props.type];
    var get = function (name) { return parse(storage.getItem(name)); };
    var storageNames = get(BROWSER_STORAGE_NAMES);
    var storageName = props.name;
    var storageItemNames = get(storageName);
    var events = {};
    var api = {
        set: function (name, options) {
            if (options === void 0) { options = {}; }
            var data = options.data;
            if (name === undefined)
                throw Error('name cannot be undefined');
            if (data === undefined)
                throw Error('data cannot be undefined');
            var storageItemNames = get(storageName);
            if (!storageItemNames.includes(name)) {
                storage.setItem(storageName, stringify(__spreadArrays(storageItemNames, [name])));
            }
            var createdAt = new Date().getTime();
            storage.setItem(name, stringify(__assign(__assign(__assign({}, itemProps), options), { createdAt: createdAt })));
            if (events.hasOwnProperty(name)) {
                events[name].forEach(function (event) { return event(data); });
            }
            return api;
        },
        get: function (name) {
            if (name === undefined)
                throw Error('name cannot be undefined');
            var storageItem = get(name);
            if (storageItem) {
                if (isExpired(storageItem)) {
                    api.remove(name);
                    return null;
                }
                return storageItem.data;
            }
            return null;
        },
        remove: function (name) {
            if (name === undefined)
                throw Error('name cannot be undefined');
            if (api.exists(name)) {
                var newStorageItemNames = get(storageName).filter(function (storageItemName) { return storageItemName !== name; });
                storage.removeItem(name);
                storage.setItem(storageName, stringify(newStorageItemNames));
                // what to do if storage is cleared but on event still exists
                // if (events.hasOwnProperty(name)) delete events[name];
            }
            return api;
        },
        exists: function (name) {
            if (name === undefined)
                throw Error('name cannot be undefined');
            return get(name) !== null;
        },
        clear: function () {
            var storageItemNames = get(storageName);
            storageItemNames.forEach(function (name) {
                api.remove(name);
            });
            return api;
        },
        items: function () {
            return get(storageName);
        },
        on: function (name, cb) {
            if (get(storageName).includes(name)) {
                if (!events.hasOwnProperty(name))
                    events[name] = [];
                events[name] = __spreadArrays(events[name], [cb]);
            }
        }
    };
    if (!storageNames || !storageNames.includes(storageName)) {
        storage.setItem(BROWSER_STORAGE_NAMES, stringify(storageNames ? __spreadArrays(storageNames, [storageName]) : [storageName]));
    }
    if (!storageItemNames) {
        storage.setItem(storageName, stringify([]));
    }
    else {
        storageItemNames.forEach(function (name) {
            var storageItem = get(name);
            if (isExpired(storageItem)) {
                api.remove(name);
            }
        });
    }
    return api;
};
exports.browserStorage = function (customOptions) {
    if (customOptions === void 0) { customOptions = {}; }
    var props = __assign(__assign({}, privateProps), customOptions);
    props.type =
        customOptions.type &&
            utils_1.arrayHasValue(storageTypeNames, customOptions.type)
            ? customOptions.type
            : privateProps.type;
    return Object.assign(Object.create(proto(props)));
};
