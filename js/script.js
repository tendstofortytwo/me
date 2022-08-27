function mobileConditions() {
	return !(window.innerWidth > 900 && window.innerHeight < window.innerWidth);
}

document.querySelectorAll('.works-card').forEach((el) => {
	const styles = getComputedStyle(el);
	let bgStyle = styles['background-image'];
	if(bgStyle === 'none') bgStyle = styles['background-color'];
	el.setAttribute('data-bg', bgStyle);
	const bg = document.createElement('div');
	bg.classList.add('bg');
	bg.style.background = bgStyle;
	document.querySelector('.bg-scroller').appendChild(bg);
});

function calculateBg() {
	const scrolledWindows = Math.max((window.scrollY - window.innerHeight) / window.innerHeight, 0);
	const minBg = Math.floor(scrolledWindows);
	const maxBg = minBg + 1;
	let delta = scrolledWindows - minBg;
	if(delta < 0.3) {
		delta = 0;
	}
	else if(delta < 0.7) {
		delta = 2.5*(delta-0.3);
	}
	else {
		delta = 1;
	}
	
	document.querySelectorAll('.bg-scroller .bg').forEach(function(el, i) {
		let op = 0;
		if(i === minBg) {
			op = 1;
		}
		else if(i === maxBg) {
			op = delta;
		}
		el.style.opacity = op;
	});

	document.querySelectorAll('.works-card .text-container').forEach(function(el, i) {
		let op = 0;
		if(i === minBg) {
			op = 1 - delta;
		}
		else if(i === maxBg) {
			op = delta;
		}
		el.style.opacity = op;
	});
}

function updateFadingBackgrounds() {
	document.querySelectorAll('.works-card').forEach((el) => {
		if(mobileConditions()) {
			el.style.background = el.getAttribute('data-bg');
			el.querySelector('.text-container').style.opacity = '1';
		}
		else {
			el.style.background = '';
		}
	});
}

updateFadingBackgrounds();

function scrollAnimations() {
	if(!mobileConditions()) {
		calculateBg();
		document.querySelectorAll('.main h1, .main h3').forEach(function(el) {
			const scrolledFrac = window.scrollY / window.innerHeight;
			el.style.opacity = Math.min(1, 1.2 - 1.5*scrolledFrac).toString();
			el.style.position = 'relative';
			el.style.top = (scrolledFrac * window.innerHeight / 2).toString() + 'px';
		});
	}
}

//window.addEventListener('scroll', scrollAnimations);
function scrollLoop() {
	scrollAnimations();
	requestAnimationFrame(scrollLoop);
}
scrollLoop();

const canvas = document.querySelector('canvas#bg');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	updateFadingBackgrounds();
});

const ctx = canvas.getContext('2d');

class Point {
	#r;
	#x;
	#y;
	// progress below 0 is neglected, negative initial
	// progress serves to introduce random delays - 
	// at 0.05 progress points per second, for example
	// a dot with initial progress -0.15 will run 2 frames
	// after a dot with initial progress -0.05
	#initialProgress;
	#progress;

	constructor() {
		this.#r = 8;
		this.#initialProgress = -4 * Math.random();
		this.init();
	}

	// moves point to a random location and 
	// resets its progress
	init() {
		this.#x = Math.random() * canvas.width;
		this.#y = Math.random() * canvas.height;
		this.#progress = this.#initialProgress;
	}

	draw() {
		if (this.#progress >= 0) {
			// opacity of of dot changes with progress
			const isDarkMode = document.body.classList.contains('dark-mode');
			const color = isDarkMode ? 255 : 0;
			const multiplier = isDarkMode ? 0.05 : 0.005;
			ctx.fillStyle = `rgba(${color}, ${color}, ${color}, ${Math.sqrt(this.#progress * multiplier)})`;
			ctx.beginPath();
			// radius calculation: maps progress from [0, 1] to [0, pi],
			// then takes sine of that to get an increase, then decrease
			// in radius. absolute value to prevent floating point errors
			// accidentally causing negative sine values which cause ctx.arc
			// to throw errors
			ctx.arc(this.#x, this.#y, Math.abs(Math.sin(Math.PI * this.#progress) * this.#r), 0, 2 * Math.PI);
			ctx.fill();
		}
	}

	render() {
		// stars come faster than they go
		// so user can look at them longer
		// i guess? idk this just looked pretty
		if (this.#progress > 0.5) {
			this.#progress += 0.005;
		}
		else {
			this.#progress += 0.05;
		}
		this.draw();
		if (this.#progress >= 1) {
			this.init();
		}
	}
}

const dots = [];

const n = 20;

for(let i = 0; i < n; i++) {
	dots[i] = new Point();
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

const sentences = [
	'Semicolons optional.',
	'Best viewed in Visual Studio Code.',
	'sh -c "$(curl -sL https://nsood.in/randomscript.sh)"',
	'This text is subject to change.',
	'Alliteration alert!',
	'Boolean logic jokes are funny, whether you laugh xor not.',
];

let counter = 1;

const ticker = document.querySelector('footer .ticker');

function changeText() {
	const el = ticker;
	const text = sentences[counter];
		oldText = el.textContent;

	const x = setInterval(function() {
		if(oldText.length != 0) {
			oldText = oldText.slice(0, -1);
			el.textContent = oldText;
		}
		else {
			setTimeout(function() {
				const y = setInterval(function() {
					if(el.textContent.length != text.length) {
						el.textContent = text.slice(0, el.textContent.length+1);
					}
					else {
						setTimeout(function() {
							if(counter >= sentences.length - 1)
								counter = 0;
							else
								counter++;

							changeText();
						}, 5000);
						clearInterval(y);
					}
				}, 60);
			}, 60);
			clearInterval(x);
		}
	}, 60);
}

ticker.textContent = sentences[0];

setTimeout(changeText, 5000);

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
