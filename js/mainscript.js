var sunX = window.innerWidth/2, sunY = window.innerHeight/2

var imgSun = document.getElementById('sun');
var imgMercury = document.getElementById('mercury');
var imgVenus = document.getElementById('venus');
var imgEarth = document.getElementById('earth');
var imgMars = document.getElementById('mars');
imgs = [imgSun, imgMercury, imgVenus, imgEarth, imgMars]

var canvas = document.querySelector('canvas'),
	ctx = canvas.getContext("2d"),
	particles = [],
    path = [],
	maxSize=3,
	planetSize = 10,
	emitters = [
		//new Emitter(new Vector(800, 400), getVector(-0.8, 2.5), 0),
	],
	
	fields = []
	
	planets = [
        new Planet('Sun', 0, 0, 0, 50, '#FAF71C', 1), // (name, velocity, angle, distance, radius, color, excentresitet)
		new Planet('Mercury', 47.36 /*Math.random() * 5 - 5*/, (Math.random() * 2) * Math.PI , 136, 4.880, '#787677', 1.48),
		new Planet('Venus', 35.02 /*Math.random() * 5 - 5*/, (Math.random() * 2) * Math.PI, 217.5, 12.104, '#C29C5E', 1.013),
		new Planet('Earth', 29.78 /*Math.random() * 5 - 5*/, (Math.random() * 2) * Math.PI, 304, 12.742, '#007fff', 1.04),
		new Planet('Mars', 24.13 /*Math.random() * 5 - 5*/, (Math.random() * 2) * Math.PI, 498, 6.780, '#991400', 1.21),
	],
	maxParticles = 30000,
	emissionRate = 3
	
var span = document.querySelector('span')

var background = new Image();
background.src = "img/sky.jpg";

canvas.width = window.innerWidth
canvas.height = window.innerHeight - canvas.offsetTop

var planetsShow = [false, false, false, false, false]
var planetsShowOrbit = [false, false, false, false, false]

function mouseMoved(e) {
	var mouseDist = (e.clientX - sunX) * (e.clientX - sunX) + (e.clientY - canvas.offsetTop - sunY) * (e.clientY - canvas.offsetTop - sunY)
	for (var i = 0; i < planets.length; i++) {
		if (mouseDist > Math.pow(planets[i].distance - 42, 2) && mouseDist < Math.pow(planets[i].distance + 42, 2))
			planetsShow[i] = true;
		else 
			planetsShow[i] = false;
	}
	
	// !!!Этот блок не удаляйте!!!
    // for (var i = 0; i < planets.length; i++) {
        // if ((e.clientX <= (planets[i].position.x + planets[i].radius + 10)) && (e.clientX >= (planets[i].position.x - (planets[i].radius + 10))) && ((e.clientY - 20) <= (planets[i].position.y + planets[i].radius + 10)) && ((e.clientY - 20) >= (planets[i].position.y - (planets[i].radius + 10)))) {
            // planetsShow[i] = true
        // }
        // else {
            // planetsShow[i] = false
        // }
    // }   
}

setInterval(function() {
    clear()
	ctx.drawImage(background, 0, 0);
	for (var i = 0; i < planets.length; i++) {
        if (planetsShow[i]) {
			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.ellipse(sunX, sunY, planets[i].distance / planets[i].ex, planets[i].distance, 90 * Math.PI/180, 0, 2 * Math.PI);
			ctx.strokeStyle = '#42aaff';
			ctx.stroke();
		}
	}
	
	for (var i = 0; i < planets.length; i++) {
		ctx.drawImage(imgs[i], planets[i].position.x - planets[i].radius, planets[i].position.y - planets[i].radius, planets[i].radius * 2, planets[i].radius * 2);
	}
	
    draw()
	
    for (var i = 0; i < planets.length; i++) {
        if (planetsShow[i]) {
			ctx.fillStyle = "black"
			ctx.globalAlpha = 0.6;
			ctx.fillRect(planets[i].position.x + planets[i].radius , planets[i].position.y - planets[i].radius - 60, 250, 60);
			ctx.globalAlpha = 1.0;
            ctx.rect(planets[i].position.x + planets[i].radius , planets[i].position.y - planets[i].radius - 60, 250, 60);
            ctx.strokeStyle = "white";
            ctx.stroke();
			ctx.font = "15px Comic Sans MS";
			ctx.fillStyle = "white"
			var plX = planets[i].position.x - sunX, plY = planets[i].position.y - sunY
			var distToSun = Math.sqrt(plX * plX + plY * plY)
			ctx.fillText('Name: ' + planets[i].name, planets[i].position.x + planets[i].radius + 5, planets[i].position.y - planets[i].radius - 42)
			ctx.fillText('Radius: ' + planets[i].radius/2*1000 + ' (km)', planets[i].position.x + planets[i].radius + 5, planets[i].position.y - planets[i].radius - 25)
			if (i != 0)
				ctx.fillText('Distance to the Sun: ' + Number((distToSun/2).toFixed(0)) + ' (mill km)', planets[i].position.x + planets[i].radius + 5, planets[i].position.y - planets[i].radius - 8);
		}
    }	
	
	update()
	
}, 10)

function update() {
	addNewParticles()
	plotParticles(canvas.width, canvas.height)
	if (document.getElementById("check1").checked) {
	    PlanetMove()
	}
	//mouseMoved(e);
}

//setInterval(checkPlanetHover(), 1000);


function deletePlanet(){
	planets.splice(1, 1)
	imgs.splice(1, 1)
}

function addPlanetEm(){
	emitters.push(new Emitter(new Vector(800, 400), getVector(-0.8, 2.5), 0))
}

function addEmitter(e) {
	window.tempEmitter = new Emitter(new Vector(e.clientX , e.clientY - canvas.offsetTop), getVector(0, 2), 0)
	console.log(canvas.offsetTop)
	window.startX = e.clientX 
	window.startY = e.clientY - canvas.offsetTop
}

function createParticles() { 
	for (var i = 0; i < canvas.width; i+=50) {
		for (var j = 0; j < canvas.height; j+=50) {
			particles.push(new Particle(new Vector(i, j), new Vector(0, 0)))
		}
	}
}

/*function createRandomField(e) { //add random field
	fields.push(
		new Field(
			new Vector(
				Math.random()*canvas.width,
				Math.random()*canvas.height
			),
			500//Math.random()*1000-500
		)
	)
}*/

function deleteLastField() { 
	fields.pop()
}

function addEmitterFinish(e) {
	var emitter = window.tempEmitter
	var vec = new Vector(e.clientX - window.startX, e.clientY - canvas.offsetTop - window.startY)
	var angle = vec.getAngle()
	var magnitude = vec.getMagnitude()
	emitter.velocity = getVector(angle, magnitude/100)
	emitters.push(emitter)
	document.getElementById("textField1").value = Math.round(magnitude);
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function draw() {
	drawParticles()
	span.innerHTML = particles.length
	//fields.forEach(drawCircle)
	emitters.forEach(drawEmitter)
	planets.forEach(drawCircle)
}

function addNewParticles() { 
	if (particles.length>maxParticles) {
		return
	}
	for (var j = 0; j < emitters.length; j++) {
		for (var i = 0; i < emissionRate; i++) {
			particles.push(emitters[j].emitParticle())
		}
	}
}

function PlanetMove(){
	for (var i = 0; i < planets.length; i++) {
		var planet = planets[i];
		//planet.position.x = 680 + Math.cos(planet.angle) * 180;
		//planet.position.y = 300 + Math.sin(planet.angle) * 180;

		planet.position.x = planets[0].position.x + Math.cos(planet.angle) * planet.distance;
		planet.position.y = planets[0].position.y + Math.sin(planet.angle) * planet.distance / planets[i].ex;
		planet.angle += planet.velocity/10000;	
	}
}

function plotParticles(boundsX, boundsY) {
	var currentParticles = []
	for (var i = 0; i < particles.length; i++) {
		var particle = particles[i]
		var pos = particle.position
		if(pos.x<0 || pos.x>boundsX || pos.y<0 || pos.y>boundsY) {
			continue
		}
		var skip = false;
		//for (var j = 0; j < fields.length; j++) {
		//    if (Math.abs(pos.x - fields[j].position.x) <= fields[j].radius * 0.8 && Math.abs(pos.y - fields[j].position.y) <= fields[j].radius * 0.8) {
		//		skip = true
		//		break
		//	}
		//}
		for (var j = 0; j < planets.length; j++) {
		    //if (Math.abs(pos.x - planets[j].position.x) <= (planets[j].radius*0.8) && Math.abs(pos.y - planets[j].position.y) <= (planets[j].radius*0.8)) {
		    if (Math.sqrt(((pos.x - planets[j].position.x) * (pos.x - planets[j].position.x)) + ((pos.y - planets[j].position.y) * (pos.y - planets[j].position.y))) <= (planets[j].radius*0.8)) {
		        skip = true
		        break
		    }
		}
		if (skip) {
			continue
		}
		particle.submitToFields(fields)
		particle.move()
		currentParticles.push((particle))
	}
	particles = currentParticles
}

function drawParticles() {
	ctx.fillStyle = '#fff'
	for (var i = 0; i < particles.length; i++) {
		var position = particles[i].position
		ctx.fillStyle = particles[i].color
		ctx.fillRect(position.x, position.y, Math.random()*maxSize, Math.random()*maxSize)
	}
}

function getVector (angle, magnitude) {
  return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
}

function drawEmitter(object) {
	ctx.fillStyle = object.drawColor
	ctx.beginPath()
	ctx.arc(object.position.x, object.position.y, maxSize, 0, Math.PI*2)
	ctx.closePath()
	ctx.fill()
}

function drawCircle(object) {
	ctx.fillStyle = object.drawColor
	ctx.beginPath()
	ctx.arc(object.position.x, object.position.y, 0, 0, Math.PI*2)
	ctx.closePath()
	ctx.fill()
}

function Vector(x, y) {
	this.x = x || 0
	this.y = y || 0
	this.add = function(vector) {
		this.x += vector.x
		this.y += vector.y
	}
	this.getMagnitude = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y)
	}
	this.getAngle = function() {
		return Math.atan2(this.y, this.x)
	}
}

function Particle(point, velocity, acceleration) {
	var colors = ['lime', 'blue', 'lightblue',]
	this.color = colors[Math.floor(Math.random()*colors.length)]
	this.color = 'white'
	//this.color = "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")"
	this.position = point || new Vector(0, 0)
	this.velocity = velocity || new Vector(0, 0)
	this.acceleration = acceleration || new Vector(0, 0)
	this.move = function() {
		this.velocity.add(this.acceleration)
		this.position.add(this.velocity)
	}
	this.submitToFields = function (fields) {
		var totalAccelerationX = 0
		var totalAccelerationY = 0
		//for (var i = 0; i < fields.length; i++) {
		//	var field = fields[i]
		//	var vectorX = field.position.x - this.position.x
		//	var vectorY = field.position.y - this.position.y
		//	var force = 0.005 * field.mass / (vectorX*vectorX + vectorY*vectorY)
		//	totalAccelerationX += vectorX*force
		//	totalAccelerationY += vectorY*force
		//}

		for (var i = 0; i < planets.length; i++) {
			var planet = planets[i]
			//var vectorX = planet.position.x - this.position.x
			var vectorX = planet.position.x - this.position.x;
			var vectorY = planet.position.y - this.position.y;
		    //var vectorY = planet.position.y - this.position.y
			var force = 1.5 * planet.mass / ((vectorX*vectorX + vectorY*vectorY)*100)
			totalAccelerationX += vectorX*force
			totalAccelerationY += vectorY*force
		}
		this.acceleration = new Vector(totalAccelerationX, totalAccelerationY)
	}
}

function Emitter(point, velocity, spread) {
	this.position = point;
	this.velocity = velocity;
	this.spread = spread || 0;
	this.drawColor = '#999'
	this.emitParticle = function() {
		var angle = this.velocity.getAngle() + this.spread - (Math.random()* this.spread * 2)
		var magnitude = this.velocity.getMagnitude()
		var position = new Vector(this.position.x, this.position.y)
		var velocity = getVector(angle, magnitude)
		var acceleration = new Vector(0, 0)
		return new Particle(position, velocity, acceleration)
	} 
}
//function Field (point, mass, radius) {
//    this.position = point
//    this.radius = radius
//	this.mass = mass 
//	this.drawColor = mass < 0 ? '#f00' : '#ffff00'
//}

function Planet(name, velocity, angle, distance, radius, color, ex) {
	//this.position = point
	this.velocity = velocity
	this.mass = radius * 10;
	this.angle = angle
	this.distance = distance
	this.radius = radius
	this.drawColor = color
	this.position = new Vector(sunX + this.distance * Math.cos(this.angle), sunY + this.distance * Math.sin(this.angle))
	this.name = name
    this.ex = ex

}

/*function startCreateParticles (event) {
	window.interval = setInterval(function () {
		var position = new Vector(event.clientX, event.clientY)
		var velocity = new Vector(
			Math.random()*20-10,
			Math.random()*20-10
		)
		var acceleration = new Vector(0, 0)
		var particle = new Particle(position, velocity, acceleration)
		particles.push(particle)
	}, 10)
}

function stopCreateParticles (event) {
	clearInterval(window.interval)
}*/
/*
function draw(argument) {
	var a_canvas = document.getElementById('a')
	var width = a_canvas.width
	var height = a_canvas.height
	var a_context = a_canvas.getContext("2d")
	var startX = Math.floor(Math.random()*(a_canvas.width))
	var startY = Math.floor(Math.random()*(a_canvas.height))
	window.interval = setInterval(function() {
		a_context.fillRect(startX, startY, 1, 1)
		startX = Math.floor(Math.random()*(a_canvas.width))
		startY = Math.floor(Math.random()*(a_canvas.height))
	}, 1)
}
});
function draw() {
	var a_canvas = document.getElementById('a')
	var width = a_canvas.width
	var height = a_canvas.height
	var a_context = a_canvas.getContext("2d")
	var startX = Math.floor(Math.random()*(a_canvas.width))
	var startY = 0
	var X = startX
	var Y = startY
	a_context.fillRect(X, Y, 1, 1)
	var direction = 1 
	window.interval = setInterval(function() {
		if (X==width) {
			if (direction==1) {
				direction=2
			} else if (direction==4) {
				direction=3
			}
		} else if (X==0) {
			if (direction==2) {
				direction=1
			} else if (direction==3) {
				direction=4
			}
		}

		if (Y==height) {
			if (direction==1) {
				direction=4
			} else if (direction==2) {
				direction=3
			}
		} else if (Y==0) {
			if (direction==3) {
				direction=2
			} else if (direction==4) {
				direction=1
			}
		}
		if (direction==1) {
			X++
			Y++
		} else if (direction==2) {
			X--
			Y++
		} else if (direction==3) {
			X--
			Y--
		} else {
			X++
			Y--
		}
		a_context.fillRect(X, Y, 1, 1)
		if (X==startX && Y==startY) {
			X = Math.floor(Math.random()*(a_canvas.width))
			Y = 0
			startX = X
			startY = Y
		}
	}, 1);
}
function stopDraw () {
	clearInterval(window.interval)
}*/