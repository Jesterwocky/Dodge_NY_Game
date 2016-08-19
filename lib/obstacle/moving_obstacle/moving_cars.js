const Obstacle = require('../obstacle.js');
const DodgeNyGame = require('../../dodge_ny_game.js');

// NOT DRY!!
const FIELDWIDTH = 500;
const FIELDHEIGHT = 500;

function MovingCar(options) {
  defaults = {
    center: [
      (FIELDWIDTH - (FIELDWIDTH / 3)) - (3/8) * (FIELDWIDTH - (FIELDWIDTH / 3)),
      100
    ],
    width: 40,
    height: 75,
    color: "#4C6B9E",
    direction: -1,
    speed: 30,
  };

  Object.assign(defaults, options);

  // Use this to DRY up code.
  // Obstacle.call(this, defaults);

  this.center = defaults.center;
  this.width = defaults.width;
  this.height = defaults.height;
  this.color = defaults.color;
  this.direction = defaults.direction;
  this.speed = defaults.speed;
}

function Surrogate() {}
Surrogate.prototype = Obstacle.prototype;
this.prototype = new Surrogate();
this.prototype.constructor = this;

// Shouldn't need this; should inherit
MovingCar.prototype.isOffCanvas = function () {
  return false;
};

MovingCar.prototype.move = function() {
  this.center[1] += this.speed * this.direction;
};

MovingCar.prototype.render = function (canvasContext) {
  this.draw(canvasContext);
  this.move();
};

// Shouldn't need this; should inherit
MovingCar.prototype.draw = function (canvasContext) {
  canvasContext.fillStyle = this.color;
  canvasContext.fillRect(
    this.center[0],
    this.center[1],
    this.width,
    this.height
  );
};

module.exports = MovingCar;
