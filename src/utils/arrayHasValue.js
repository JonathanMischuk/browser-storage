"use strict";
exports.__esModule = true;
exports.arrayHasValue = function (arr, value) {
    if (!Array.isArray(arr))
        throw Error('no array supplied for includes(arr, value) first argument');
    return arr.includes(value);
};
