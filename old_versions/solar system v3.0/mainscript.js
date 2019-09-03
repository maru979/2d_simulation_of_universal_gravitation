var canvas = document.querySelector('canvas'),
	ctx = canvas.getContext("2d"),
	particles = [],
	maxSize=3,
	planetSize = 10,
	emitters = [
		//new Emitter(new Vector(200, 200), getVector(0, 2), Math.PI/50),
	],
	fields = [
		 new Field(new Vector(680, 400), 500, 50),
		// new Field(new Vector(200, 200), 500),
		// new Field(new Vector(800, 200), 500),
		// new Field(new Vector(800, 800), 300),
		// new Field(new Vector(200, 800), 300),
	],
	planets = [
		new Planet(new Vector(500, 400), 2.5, 500, Math.PI / 2, 120, 10, '#009900'),
		new Planet(new Vector(350, 400), 2, 500, Math.PI / 2, 250, 15, 'blue'),
		new Planet(new Vector(500, 400), 3, 500, Math.PI / 2, 350, 20, '#470b00')
	],
	maxParticles = 30000,
	emissionRate = 3
var span = document.querySelector('span')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

setInterval(function() {
	clear()
	draw()
	update()
}, 10)

function addEmitter(e) {
	window.tempEmitter = new Emitter(new Vector(e.clientX, e.clientY), getVector(0, 2), 0)
	window.startX = e.clientX
	window.startY = e.clientY
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
	var vec = new Vector(e.clientX-window.startX, e.clientY-window.startY)
	var angle = vec.getAngle()
	var magnitude = vec.getMagnitude()
	emitter.velocity = getVector(angle, magnitude/100)
	emitters.push(emitter)
	document.getElementById("textField1").value = Math.round(magnitude);
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function update() {
	addNewParticles()
	plotParticles(canvas.width, canvas.height)
	PlanetMove();
}

function draw() {
	drawParticles()
	span.innerHTML = particles.length
	fields.forEach(drawCircle)
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

		planet.position.x = fields[0].position.x + Math.cos(planet.angle) * planet.radius;
		planet.position.y = fields[0].position.y + Math.sin(planet.angle) * planet.radius;
		planet.angle += planet.velocity/1000;	
	}
}

function plotParticles(boundsX, boundsY) {
	var currentParticles =[]
	for (var i = 0; i < particles.length; i++) {
		var particle = particles[i]
		var pos = particle.position
		if(pos.x<0 || pos.x>boundsX || pos.y<0 || pos.y>boundsY) {
			continue
		}
		var skip = false;
		for (var j = 0; j < fields.length; j++) {
		    if (Math.abs(pos.x - fields[j].position.x) <= fields[j].size * 0.8 && Math.abs(pos.y - fields[j].position.y) <= fields[j].size * 0.8) {
				skip = true
				break
			}
		}
		for (var j = 0; j < planets.length; j++) {
		    if (Math.abs(pos.x - planets[j].position.x) <= (planets[j].size*0.8) && Math.abs(pos.y - planets[j].position.y) <= (planets[j].size*0.8)    ) {
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
	ctx.arc(object.position.x, object.position.y, object.size, 0, Math.PI*2)
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
	this.color = '#00F'
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
		for (var i = 0; i < fields.length; i++) {
			var field = fields[i]
			var vectorX = field.position.x - this.position.x
			var vectorY = field.position.y - this.position.y
			var force = 0.005 * field.mass / (vectorX*vectorX + vectorY*vectorY)
			totalAccelerationX += vectorX*force
			totalAccelerationY += vectorY*force
		}

		for (var i = 0; i < planets.length; i++) {
			var planet = planets[i]
			var vectorX = planet.position.x - this.position.x
			var vectorY = planet.position.y - this.position.y
			var force = 0.005 * planet.mass / (vectorX*vectorX + vectorY*vectorY)
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
function Field (point, mass, size) {
    this.position = point
    this.size = size
	this.mass = mass 
	this.drawColor = mass < 0 ? '#f00' : '#ffff00'
}

function Planet (point, velocity, mass, angle, radius, size, color){
	this.position = point
	this.velocity = velocity
	this.mass = mass 
	this.angle = angle
	this.radius = radius
	this.size = size
	this.drawColor = color
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