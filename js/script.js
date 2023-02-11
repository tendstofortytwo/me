const canvas = document.querySelector('canvas#bg');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');
const FILL_STYLES = {
	light: 'rgba(0,0,0,0.05)',
	dark: 'rgba(255,255,255,0.15)'
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
		this.progress = initialProgress;
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
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
document.querySelector('.age').textContent = `${tens[Math.floor(age / 10)]} ${ones[age % 10]}`;

// easter egg

const sequences = [
	'DARK',
	'LITE',
	'PURP',
	'MINT',
	'YELL',
	'BLUE',
	'SAVE'
].map(seq => {
	return {
		word: seq,
		combo: seq.split('').map(c => 'Key' + c)
	}
});

const lastFourKeys = [];

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

			const clapper = document.querySelector('.clapper');
			clapper.classList.toggle('clapping');
			setTimeout(() => {
				document.body.setAttribute('class', `${word.toLowerCase()}-mode`);
				setTimeout(() => clapper.classList.toggle('clapping'), 500);
			}, 500);
		}
	});
});

function among() {
	alert('haha among us');
}

document.querySelector('.among').addEventListener('click', e => {
	e.preventDefault();
	among();
});
