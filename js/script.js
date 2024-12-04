const canvas = document.querySelector('canvas#bg');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
const FILL_STYLES = {
	light: 'rgba(0,0,0,0.15)',
	dark: 'rgba(255,255,255,0.25)'
};

const colorMode = localStorage.getItem('color-mode');

if(colorMode) {
	document.body.setAttribute('class', colorMode);
}

addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

function isDarkMode() {
	return document.body.classList.contains('dark-mode') || 
		(document.body.classList.length === 0 && matchMedia('(prefers-color-scheme: dark)').matches);
}

function contains(rect, x, y) {
	return (rect.left <= x && x <= rect.right) && (rect.top <= y && y <= rect.bottom);
}

function Point() {
	const r = 8;
	
	// progress below 0 is neglected, negative initial
	// progress serves to introduce random delays - 
	// at 0.05 progress points per second, for example
	// a dot with initial progress -0.15 will run 2 frames
	// after a dot with initial progress -0.05
	const initialProgress = -4 * Math.random();
	
	// moves point to a random location and 
	// resets its progress
	this.init = function() {
		const textbox = document.querySelector('.text-container').getBoundingClientRect();
		this.progress = initialProgress;
		do {
			this.x = Math.random() * canvas.width;
			this.y = Math.random() * canvas.height;
		} while(contains(textbox, this.x, this.y));
		this.r = 0;
		this.rng = Math.random();
	}
	
	this.draw = function() {
		if(this.progress >= 0) {
			ctx.fillStyle = isDarkMode() ? FILL_STYLES.dark : FILL_STYLES.light;
			ctx.beginPath();
			// radius calculation: maps progress from [0, 1] to [0, pi],
			// then takes sine of that to get an increase, then decrease
			// in radius. absolute value to prevent floating point errors
			// accidentally causing negative sine values which cause ctx.arc
			// to throw errors
			ctx.arc(this.x, this.y, Math.abs(Math.sin(Math.PI*this.progress)*r), 0, 2*Math.PI);
			ctx.fill();
		}
	};
	this.render = function() {
		// stars come faster than they go
		// so user can look at them longer
		// i guess? idk this just looked pretty
		if(this.progress > 0.5) this.progress += 0.005;
		else this.progress += 0.05;
		this.draw();
		if(this.progress >= 1) this.init();
	}
}

const dots = [];

const n = 20;

for(let i = 0; i < n; i++) {
	dots[i] = new Point();
	dots[i].init();
}

function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(let i = 0; i < n; i++) {
		dots[i].render();
	}
		
	requestAnimationFrame(loop);
}

loop();

// slight convenience: fix the header section with my correct age automatically

const birthday = {
	date: 19,
	month: 0,
	year: 2001,
}
const today = new Date();
let age = today.getFullYear() - birthday.year;
if(today.getMonth() < birthday.month || (today.getMonth() == birthday.month && today.getDate() < birthday.date)) {
	--age;
}
const tens = ['', ' ten plus', ' twenty', ' thirty', ' forty', ' fifty', ' sixty', ' seventy', 'n eighty', ' ninety'];
const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
document.querySelector('.description').textContent = `a${tens[Math.floor(age / 10)]} ${ones[age % 10]} year-old`;

// easter egg

const sequences = [
	'YELL',
	'LITE',
	'PURP',
	'DARK',
	'BLUE',
	'PINK',
	'MINT',
	'SAVE'
].map(seq => ({
	word: seq,
	combo: seq.split('').map(c => 'Key' + c)
}));

const lastFourKeys = [];

function changeColor(word) {
	const clapper = document.querySelector('.clapper');
	clapper.classList.toggle('clapping');
	setTimeout(() => {
		document.body.setAttribute('class', `${word.toLowerCase()}-mode`);
		document.querySelector(`#change-color-to-${word}`).checked = true;
		setTimeout(() => clapper.classList.toggle('clapping'), 500);
	}, 500);
}

addEventListener('keypress', e => {
	lastFourKeys.push(e.code);
	while(lastFourKeys.length > 4) lastFourKeys.shift();
	sequences.forEach(({word, combo}) => {
		if(combo.every((v, i) => v === lastFourKeys[i])) {
			if(word === 'SAVE') {
				if(confirm('Would you like to save the current color mode to local browser storage?')) {
					localStorage.setItem('color-mode', document.body.getAttribute('class'));
				}
				return;
			}

			changeColor(word);
		}
	});
});

document.querySelector('button.change-color-button').addEventListener('click', () => {
	document.querySelector('dialog.change-color-dialog').show();
});

sequences.forEach(({word}) => {
	// mint is deprecated, only kept here for backwards compatibility
	if(word !== 'SAVE' && word !== 'MINT') {
		const container = document.createElement('div');

		const radio = document.createElement('input');
		radio.type = 'radio';
		radio.name = 'change-color-radio';
		radio.id = `change-color-to-${word}`;
		radio.checked = document.body.classList.contains(`${word.toLowerCase()}-mode`) ||
			(document.body.classList.length === 0 && 
				((isDarkMode() && word === 'DARK') || (!isDarkMode() && word === 'LITE')));
		radio.addEventListener('click', () => {
			changeColor(word);
		});

		const label = document.createElement('label');
		label.setAttribute('for', radio.id);
		const color = document.createElement('div');
		color.setAttribute('style', 
			`background-color: var(--${word.toLowerCase()}Color); color: var(--${word.toLowerCase()}Text)`);
		label.appendChild(color);
		label.setAttribute('aria-label', word.toLowerCase());

		container.appendChild(radio);
		container.appendChild(label);

		document.querySelector('.change-color-dialog .radio-buttons').appendChild(container);
	}
});

document.querySelector('#color-change-save').addEventListener('click', () => {
	localStorage.setItem('color-mode', document.body.getAttribute('class'));
	alert('Saved!');
});

function among() {
	alert('haha among us');
}

document.querySelector('.among').addEventListener('click', e => {
	e.preventDefault();
	among();
});
