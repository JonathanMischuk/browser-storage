import { browserStorage } from '../src/index';

const storage = browserStorage({
	name: 'funStorage',
	type: 'localStorage'
});

const storagePoop = browserStorage({
	name: 'storagePoop'
});

const button01 = document.querySelector('#button01');
const button02 = document.querySelector('#button02');
const button03 = document.querySelector('#button03');
const button04 = document.querySelector('#button04');

const dynamicText01 = document.querySelector('#dynamic-text-01');
const dynamicText02 = document.querySelector('#dynamic-text-02');

button01.addEventListener('click', e => {
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

button02.addEventListener('click', e => {
	storage.clear();
});

button03.addEventListener('click', e => {
	storage.remove('poopy');
});

button04.addEventListener('click', e => {
	const data = storage.get('floopy');

	dynamicText01.innerHTML = data ? data.name : 'no data';
});

storage.on('flubber', value => {
	dynamicText02.innerHTML = value[0];
});

storage.on('poopy', value => {
	dynamicText01.innerHTML = value;
});

storage.on('poopy', value => {
	console.log('yo mama');
});

storage.on('ultra feast', value => {
	console.log('ultra feast bitches');
});

storage.on('ultra feasters', value => {
	console.log('ultra feast bitches');
});
