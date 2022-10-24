const canvas = document.querySelector('canvas#bg');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

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
		this.x = Math.random() * canvas.width;
		this.y = Math.random() * canvas.height;
		this.progress = initialProgress;
	}
	
	this.draw = function() {
		if(this.progress >= 0) {
			// opacity of of dot changes with progress
			const isDarkMode = document.body.classList.contains('dark-mode');
			const color = isDarkMode ? 255 : 0;
			const multiplier = isDarkMode ? 0.05 : 0.005;
			ctx.fillStyle = `rgba(${color}, ${color}, ${color}, ${Math.sqrt(this.progress*multiplier)})`;
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
		if(this.progress > 0.5)
			this.progress += 0.005;
		else
			this.progress += 0.05;
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
	if(window.scrollY <= window.innerHeight) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	
		for(let i = 0; i < n; i++) {
			dots[i].render();
		}
	}
		
	requestAnimationFrame(loop);
}

loop();

// slight convenience: fix the header section with my correct age automatically

const birthday = {
	date: 19,
	month: 1,
	year: 2001,
}
const today = new Date();
let age = today.getFullYear() - birthday.year;
if(today.getMonth() <= birthday.month && today.getDate() < birthday.date) {
	--age;
}
const tens = ['', ' ten plus', ' twenty', ' thirty', ' forty', ' fifty', ' sixty', ' seventy', 'n eighty', ' ninety'];
const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
document.querySelector('.age').textContent = `${tens[Math.floor(age / 10)]} ${ones[age % 10]}`;

// easter egg

const sequences = [
	[ 99, 108, 97, 112, 111, 102, 102 ],
	[ 99, 108, 97, 112, 111, 110 ],
];

let mode = 0;

let eei = 0;

addEventListener('keypress', e => {
	const clapper = document.querySelector('.clapper');
	const sequence = sequences[mode];
	if(e.keyCode == sequence[eei]) {
		eei++;
	}
	else {
		eei = 0;
	}

	if(eei == sequence.length) {
		clapper.classList.toggle('clapping');
		setTimeout(() => {
			if(mode === 1) {
				document.body.classList.remove('dark-mode');
				mode = 0;
			}
			else {
				document.body.classList.add('dark-mode');
				mode = 1;
			}
			eei = 0;
			setTimeout(() => clapper.classList.toggle('clapping'), 500);
		}, 500);
	}
});

function among() {
	alert('haha among us');
}
