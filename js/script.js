var firstInit = true;

function mobileConditions() {
	return !(window.innerWidth > 900 && window.innerHeight < window.innerWidth);
}

function tag(name, classes, id) {
	const el = document.createElement(name);
	if(classes) {
		for(let c of classes) {
			el.classList.add(c);
		}
	}
	if(id) {
		el.id = id;
	}
	return el;
}

function bgInit(useCSSbg) {	
	document.querySelectorAll('.works-card').forEach((el) => {
		const styles = getComputedStyle(el);
		if(firstInit) {
			let bg = styles['background-image'];
			if(bg === 'none') bg = styles['background-color'];
			el.setAttribute('data-bg', bg);
			const bgEl = tag('div', ['bg']);
			bgEl.style.background = bg;
			document.querySelector('.bg-scroller').appendChild(bgEl);
		}

		if(useCSSbg) {
			el.style.background = el.getAttribute('data-bg');
			el.querySelector('.text-container').styles.opacity = '1';
		}
		else {
			el.style.background = '';
		}
	});
	
	firstInit = false;
}

bgInit(false);

function calculateBg() {
	if(!mobileConditions()) {
		bgInit(false);
		let backgrounds = document.querySelector('.bg-scroller').querySelectorAll('.bg');
		let bgOps = new Array(backgrounds.length).fill(0);
		let textOps = new Array(backgrounds.length).fill(0);
		let scrolledWindows = (window.scrollY - window.innerHeight) / window.innerHeight;
		if(scrolledWindows < 0) scrolledWindows = 0;
		let minBg = Math.floor(scrolledWindows);
		let maxBg = minBg + 1;
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

		//delta = -1 * Math.cos(delta/1 * (Math.PI/2)) + 1;
		
		bgOps[minBg] = 1;
		bgOps[maxBg] = delta;
		backgrounds.forEach(function(el, i) {
			el.style.opacity = bgOps[i];
		});

		textOps[minBg] = 1-delta;
		textOps[maxBg] = delta;
		document.querySelectorAll('.works-card .text-container').forEach(function(el, i) {
			el.style.opacity = textOps[i];
		});
	}
	
	else {
		bgInit(true);
	}
}

calculateBg();

function scrollAnimations() {
	calculateBg();

	if(!mobileConditions()) {
		document.querySelectorAll('.main h1, .main h3').forEach(function(el) {
			var scrolledFrac = window.scrollY / window.innerHeight;
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

var canvas = document.querySelector('canvas#bg');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext('2d');

window.addEventListener('resize', () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
})

function Point() {
	var p = this;
	
	var r = 8;
	
	// progress below 0 is neglected, negative initial
	// progress serves to introduce random delays - 
	// at 0.05 progress points per second, for example
	// a dot with initial progress -0.15 will run 2 frames
	// after a dot with initial progress -0.05
	var initialProgress = -4 * Math.random();
	
	// moves point to a random location and 
	// resets its progress
	this.init = function() {
		p.x = Math.random() * canvas.width;
		p.y = Math.random() * canvas.height;
		p.progress = initialProgress;
	}
	
	this.draw = function() {
		if(p.progress >= 0) {
			// opacity of of dot changes with progress
			const isDarkMode = document.body.classList.contains('dark-mode');
			let color = isDarkMode ? 255 : 0;
			let multiplier = isDarkMode ? 0.05 : 0.005;
			ctx.fillStyle = `rgba(${color}, ${color}, ${color}, ${Math.sqrt(p.progress*multiplier)})`;
			ctx.beginPath();
			// radius calculation: maps progress from [0, 1] to [0, pi],
			// then takes sine of that to get an increase, then decrease
			// in radius. absolute value to prevent floating point errors
			// accidentally causing negative sine values which cause ctx.arc
			// to throw errors
			ctx.arc(p.x, p.y, Math.abs(Math.sin(Math.PI*p.progress)*r), 0, 2*Math.PI);
			ctx.fill();
		}
	};
	this.render = function() {
		// stars come faster than they go
		// so user can look at them longer
		// i guess? idk this just looked pretty
		if(p.progress > 0.5)
			p.progress += 0.005;
		else
			p.progress += 0.05;
		p.draw();
		if(p.progress >= 1) p.init();
	}
}
var dots = [];

var n = 20;

for(var i = 0; i < n; i++) {
	dots[i] = new Point();
	dots[i].init();
}

function loop() {
	if(window.scrollY <= window.innerHeight) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	
		for(var i = 0; i < n; i++) {
			dots[i].render();
		}
	}
		
	requestAnimationFrame(loop);
}

loop();

var sentences = [
	'Semicolons optional.',
	'Best viewed in Visual Studio Code.',
	'sh -c "$(curl -sL https://nsood.in/randomscript.sh)"',
	'This text is subject to change.',
	'Alliteration alert!',
	'Boolean logic jokes are funny, whether you laugh xor not.',
];

var counter = 1;

var ticker = document.querySelector("footer .ticker");

function changeText() {
	var el = ticker,
		text = sentences[counter],
		oldText = el.textContent;

	var x = setInterval(function() {
		if(oldText.length != 0) {
			oldText = oldText.slice(0, -1);
			el.textContent = oldText;
		}
		else {
			setTimeout(function() {
				var y = setInterval(function() {
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
let today = new Date();
let age = today.getFullYear() - birthday.year;
if(today.getMonth() <= birthday.month && today.getDate() < birthday.date) {
	--age;
}
const tens = ['', ' ten plus', ' twenty', ' thirty', ' forty', ' fifty', ' sixty', ' seventy', 'n eighty', ' ninety'];
const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
document.querySelector('.age').textContent = `${tens[Math.floor(age / 10)]} ${ones[age % 10]}`;

// easter egg

var sequences = [
	[ 99, 108, 97, 112, 111, 102, 102 ],
	[ 99, 108, 97, 112, 111, 110 ],
];

var mode = 0;

var eei = 0;

window.addEventListener('keypress', e => {
	const clapper = document.querySelector('.clapper');
	var sequence = sequences[mode];
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
})
