var express = require('express');
var five = require('johnny-five');
var raspi = require('raspi-io');
var Sonar = require('raspi-sonar').Sonar;

var board = new five.Board({
		io: new raspi()
});

var app = express();
var pins = [];
var proxim = [];
var proximData = [];

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/:pin/high', function (req, res) {
  if (isValidPin(req.params.pin)) {
  	var pin = parseInt(req.params.pin);
	if (pins[pin] != undefined) {
		pins[pin].high();
  		res.send('Pin ' + pin + ' set to high');
  	}
	else {
		res.send('Pin ' + pin + ' needs to be setup first');
	}
  }
  else {
	res.send('Invalid Pin');
  }
});

app.get('/:pin/low', function (req, res) {
  if (isValidPin(req.params.pin)) {
  	var pin = parseInt(req.params.pin);
	pins[pin].low();
  	res.send('Pin ' + pin + ' set to low');
  }
  else {
	res.send('Invalid Pin');
  }
});

app.get('/setup/:pin', function (req, res) {
	if (isValidPin(req.params.pin)) {
		var pin = parseInt(req.params.pin);
		pins[pin] = new five.Pin('P1-'+pin);
		res.send('Pin ' + pin + ' set as digital input');
	}
	else {
		res.send('Invalid Pin');
	}

});

app.get('/setup/hcsr04/:pin', function (req, res) {
	if (isValidPin(req.params.pin)) {
		var pin = parseInt(req.params.pin);
		proxim[pin] = new Sonar(pin);
		res.send('Pin ' + pin + ' set as HCSR04');
	}
	else {
		res.send('Invalid Pin');
	}

	
});

app.get('/hcsr04/:pin', function (req,res) {
	if (isValidPin(req.params.pin)) {
		var pin = parseInt(req.params.pin);
		proxim[pin].read(function(duration) {
  			var distance = Math.round((34300 * duration / 1000000 * .5)/2.54);
			res.send(String(distance));
		});
	}
	else {
		res.send('Invalid Pin');
	}
});

board.on('ready', function() {
	app.listen(7777, function () {
  	console.log('Example app listening on port 8888');
	});
});

function isValidPin(sPin) {
	var pin = parseInt(sPin);
	if ( (pin != NaN) && (pin >= 1) && (pin <= 40)) {
		return true;
	}
	return false;	
}
