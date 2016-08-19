const Obstacle = require('../obstacle.js');
const DodgeNyGame = require('../../dodge_ny_game.js');

// NOT DRY!!
const FIELDWIDTH = 500;
const FIELDHEIGHT = 500;

function MovingPerson(options) {
  defaults = {
    center: [0, 100],
    width: 10,
    height: 10,
    color: "#5F3E3E",
    direction: -1,
    speed: 1,
    drift: 2,
    driftDirection: -1,
    canCrossStreet: false,

    vectors: [[1, -1], [-1, -1]]
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
  this.drift = defaults.drift;
  this.driftDirection = defaults.driftDirection;
  this.canCrossStreet = defaults.canCrossStreet;

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
  canvasContext.beginPath();
  canvasContext.arc(
    this.center[0],
    this.center[1],
    this.width / 2,
    0,
    2 * Math.PI,
    false
  );
  canvasContext.fillStyle = this.color;
  canvasContext.fill();
  // canvasContext.fillRect(
  //   this.center[0],
  //   this.center[1],
  //   this.width,
  //   this.height
  // );
};

module.exports = MovingPerson;
