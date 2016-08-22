const Obstacle = require('../obstacle.js');
const DodgeNyGame = require('../../dodge_ny_game.js');

// NOT DRY!!
const FIELDWIDTH = 500;
const FIELDHEIGHT = 500;

function MovingCar(options) {
  defaults = {
    topLeft: [
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

  this.width = defaults.width;
  this.height = defaults.height;
  this.color = defaults.color;
  this.direction = defaults.direction;
  this.speed = defaults.speed;

  this.leftX   = defaults.topLeft[0];
  this.rightX  = this.leftX + this.width;
  this.topY    = defaults.topLeft[1];
  this.bottomY = this.topY + this.height;

  this.topLeft = defaults.topLeft;
  this.bottomLeft = [this.leftX, this.bottomY];
  this.topRight = [this.rightX, this.topY];
  this.bottomRight = [this.rightX, this.bottomY];
}
//
// function Surrogate() {}
// Surrogate.prototype = Obstacle.prototype;
// this.prototype = new Surrogate();
// this.prototype.constructor = this;

// Shouldn't need this; should inherit
MovingCar.prototype.isOffCanvas = function () {
  if (this.leftX <= 0 || this.rightX >= FIELDWIDTH ||
    this.topY <= 0 || this.bottomY >= FIELDHEIGHT) {
      return true;
    }

  return false;
};

MovingCar.prototype.move = function() {
  this.topLeft[1] += this.speed * this.direction;
};

MovingCar.prototype.render = function (canvasContext) {
  this.draw(canvasContext);
  this.move();
};

// Shouldn't need this; should inherit
MovingCar.prototype.draw = function (canvasContext) {
  canvasContext.fillStyle = this.color;
  canvasContext.fillRect(
    this.topLeft[0],
    this.topLeft[1],
    this.width,
    this.height
  );
};

module.exports = MovingCar;
