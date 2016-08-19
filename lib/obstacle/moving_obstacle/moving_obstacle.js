const Obstacle = require('../obstacle.js');

function MovingObstacle(options) {
  defaults = {
    center: [0, 100],
    width: 10,
    height: 10,
    color: "#5F3E3E",
    direction: -1,
    vectors: [[5, -5], [-5, -5]]
  };

  Object.assign(defaults, options);

  // Use this to DRY up code.
  // Obstacle.call(this, defaults);

  this.center = defaults.center;
  this.width = defaults.width;
  this.height = defaults.height;
  this.color = defaults.color;
  this.direction = defaults.direction;

  let vectors = [];
  for (let vector of defaults.vectors) {
    vectors.push([vector[0], vector[1] * this.direction]);
  }

  this.vectors = vectors;
}

function Surrogate() {}
Surrogate.prototype = Obstacle.prototype;
this.prototype = new Surrogate();
this.prototype.constructor = this;

// Shouldn't need this; should inherit
MovingObstacle.prototype.isOffCanvas = function () {
  return false;
};

MovingObstacle.prototype.move = function() {
  let movement = this.vectors.shift();
  this.center[0] += movement[0];
  this.center[1] += movement[1];
  this.vectors.push(movement);
};

MovingObstacle.prototype.render = function (canvasContext) {
  this.draw(canvasContext);
  this.move();
};

// Shouldn't need this; should inherit
MovingObstacle.prototype.draw = function (canvasContext) {
  canvasContext.fillStyle = this.color;
  canvasContext.fillRect(
    this.center[0],
    this.center[1],
    this.width,
    this.height
  );
};

module.exports = MovingObstacle;
