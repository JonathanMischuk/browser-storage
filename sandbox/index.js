"use strict";
exports.__esModule = true;
var src_1 = require("../src");
var storage = src_1.browserStorage({
    name: 'funStorage',
    type: 'localStorage'
});
var storagePoop = src_1.browserStorage({
    name: 'storagePoop'
});
var button01 = document.querySelector('#button01');
var button02 = document.querySelector('#button02');
var button03 = document.querySelector('#button03');
var button04 = document.querySelector('#button04');
// const button05 = document.querySelector('#button05');
var dynamicText01 = document.querySelector('#dynamic-text-01');
var dynamicText02 = document.querySelector('#dynamic-text-02');
button01.addEventListener('click', function (e) {
    storage.set('flubber', { data: ['poop in flubber'] });
    storage.set('floopy', { data: { name: 'poop in floopy' } });
    storage.set('poopy', {
        data: true,
        expiryLength: 3,
        expiryFormat: 'seconds'
    });
    storage.set('poopie', { data: 25 });
    storage.set('hmmmm', { data: null });
    storagePoop.set('interests', {
        data: ['curling', 'hockey'],
        expiryFormat: 'seconds',
        expiryLength: 5
    });
});
button02.addEventListener('click', function (e) {
    storage.clear();
});
button03.addEventListener('click', function (e) {
    storage.remove('poopy');
});
button04.addEventListener('click', function (e) {
    var data = storage.get('floopy');
    dynamicText01.innerHTML = data ? data.name : 'no data';
});
// button05.addEventListener('click', e => {
// 	storage.set('ultra feast', { data: new Date().getTime() });
// });
storage.on('flubber', function (value) {
    console.log(value);
    dynamicText02.innerHTML = value[0];
});
storage.on('poopy', function (value) {
    console.log(value);
    dynamicText01.innerHTML = value;
});
storage.on('poopy', function (value) {
    console.log('yo mama');
});
storage.on('ultra feast', function (value) {
    console.log('ultra feast bitches');
});
storage.on('ultra feasters', function (value) {
    console.log('ultra feast bitches');
});
