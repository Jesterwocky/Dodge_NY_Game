const Obstacle = require('../obstacle.js');
const DodgeNyGame = require('../../dodge_ny_game.js');

// NOT DRY!!
const FIELDWIDTH = 500;
const FIELDHEIGHT = 500;

function MovingPerson(options) {
  defaults = {
    center: [0, 100],
    width: 35,
    height: 70,
    color: "#4C6B9E",
    direction: -1,
    speed: 3,
    drift: 2,
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

  let vectors = [];
  for (let vector of defaults.vectors) {
    vectors.push([
      (vector[0] * defaults.speed) + (defaults.drift * defaults.driftDirection),
      vector[1] * defaults.speed * this.direction
    ]);
  }

  this.vectors = vectors;
}

function Surrogate() {}
Surrogate.prototype = Obstacle.prototype;
this.prototype = new Surrogate();
this.prototype.constructor = this;

// Shouldn't need this; should inherit
MovingPerson.prototype.isOffCanvas = function () {
  return false;
};

// Not DRY!!
MovingPerson.prototype.inTheRoad = function(xVal) {
  // might want to use circles instead of squares/rectangles for most
  // moving objects
  return (
    xVal > (FIELDWIDTH / 3) &&
    xVal < (FIELDWIDTH - (FIELDWIDTH / 3))
  );
};

MovingPerson.prototype.move = function() {
  let movement = this.vectors.shift();
  if (this.canCrossStreet || (!this.canCrossStreet && !this.inTheRoad(this.center[0] + movement[0]))) {
    this.center[0] = (this.center[0] + movement[0]) % FIELDWIDTH;
  }

  this.center[1] = (this.center[1] + movement[1]) % FIELDHEIGHT;
  this.vectors.push(movement);
};

// MovingPerson.prototype.changeDirection = function() {
//   this.direction = this.direction * -1;
//
//   let vectors = [];
//
//   for (let vector of defaults.vectors) {
//     vectors.push([
//       (vector[0] * defaults.speed) + (defaults.drift * defaults.driftDirection),
//       vector[1] * defaults.speed * this.direction
//     ]);
//   }
//
//   this.vectors = vectors;
// };

MovingPerson.prototype.render = function (canvasContext) {
  this.draw(canvasContext);
  this.move();
};

// Shouldn't need this; should inherit
MovingPerson.prototype.draw = function (canvasContext) {
  canvasContext.fillStyle = this.color;
  canvasContext.fillRect(
    this.center[0],
    this.center[1],
    this.width,
    this.height
  );
};

module.exports = MovingPerson;
