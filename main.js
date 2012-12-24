// Images
var rightFrame1 = new Image();
rightFrame1.onload = incrementImageCounter;
rightFrame1.src = '1.png';
var rightFrame2 = new Image();
rightFrame2.onload = incrementImageCounter;
rightFrame2.src = '2.png';
var leftFrame1 = new Image();
leftFrame1.onload = incrementImageCounter;
leftFrame1.src = '1l.png';
var leftFrame2 = new Image();
leftFrame2.onload = incrementImageCounter;
leftFrame2.src = '2l.png';

var winSound = new Audio();
winSound.src = 'tada.mp3';

var imagesLoaded = 0;
function incrementImageCounter() {
	imagesLoaded++;
	if (imagesLoaded === 4) {
		window.requestAnimationFrame(doFrame);
	}
}

// Setup requestAnimationFrame polyfill
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

// DotDrive code
var cnvs = document.getElementById('cnvs');
cnvs.width = 735;
cnvs.height = 700;
var ctx = cnvs.getContext('2d');

function drawCircle(x, y, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

var dot = {
	friction: 0.007,
	color: 'orange',
	x: 110,
	y: 110,
	speed: [0, 0],
	draw: function() {
		if (this.speed[0] >= 0) {
			if (this.x % 100 < 50) {
				ctx.drawImage(rightFrame1, this.x - 50, this.y - 50);
			}
			else {
				ctx.drawImage(rightFrame2, this.x - 50, this.y - 50);
			}
		}
		else {
			if (this.x % 100 < 50) {
				ctx.drawImage(leftFrame1, this.x - 50, this.y - 50);
			}
			else {
				ctx.drawImage(leftFrame2, this.x - 50, this.y - 50);
			}
		}
	},
	updatePosition: function() {
		this.x += this.speed[0];
		this.y += this.speed[1];

		// apply friction
		if (this.speed[0] > 0) {
			this.speed[0] -= this.friction;
		}
		else if (this.speed[0] < 0) {
			this.speed[0] += this.friction;
		}

		if (this.speed[1] > 0) {
			this.speed[1] -= this.friction;
		}
		else if (this.speed[1] < 0) {
			this.speed[1] += this.friction;
		}
	}
};

var target = {
	x: Math.random() * cnvs.width,
	y: Math.random() * cnvs.height,
	draw: function() {
		ctx.fillStyle = '#000000';
		drawCircle(this.x, this.y, 10);
	},
	hasWon: function() {
		if (Math.abs(this.x - dot.x) <= 60 && Math.abs(this.y - dot.y) <= 60) {
			return true;
		}
		else {
			return false;
		}
	}
};

var acceleration = 1.5;

function watchForConfigChanges() {
	var frictionSlider = document.getElementById('friction');
	frictionSlider.addEventListener('change', function(e) {
		dot.friction = +frictionSlider.value;
	});

	var accelerationSlider = document.getElementById('acceleration');
	accelerationSlider.addEventListener('change', function(e) {
		acceleration = +accelerationSlider.value;
	});
}

watchForConfigChanges();

function setUpKeyPressEvents() {
	var body = document.getElementsByTagName('body')[0];
	body.addEventListener('keydown', function(e) {
		switch(e.keyCode) {
		case 37:
			dot.speed[0] -= acceleration;
			break;
		case 38:
			dot.speed[1] -= acceleration;
			break;
		case 39:
			dot.speed[0] += acceleration;
			break;
		case 40:
			dot.speed[1] += acceleration;
			break;
		}
	});
}

setUpKeyPressEvents();

function paint() {
	ctx.fillStyle = '#fafafa';
	ctx.fillRect(0, 0, cnvs.width, cnvs.height);
	target.draw();
	dot.draw();
}

function doFrame() {
	dot.updatePosition();
	if (Math.abs(dot.speed[0]) < 0.1) {
		dot.speed[0] = 0;
	}
	paint();
	if (target.hasWon()) {
		var wonImage = document.getElementsByClassName('wonImage')[0];
		wonImage.style.width = '735px';
		winSound.play();
	}
	else {
		window.requestAnimationFrame(doFrame);
	}
}