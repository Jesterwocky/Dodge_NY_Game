const SCROLLSPEED = 3;

function Obstacle(options = {}) {
  defaults = {
    center: [100, 100],
    width: 3,
    height: 3,
    color: "brown",
  };

  Object.assign(defaults, options);

  this.center = defaults.center;
  this.width = defaults.width;
  this.height = defaults.height;
  this.color = defaults.color;
}

Obstacle.prototype.draw = function (canvasContext) {
  canvasContext.fillStyle = this.color;
  canvasContext.fillRect(
    center[0],
    center[1],
    width,
    height
  );
};

Obstacle.prototype.scroll = function () {
  this.center[1] += SCROLLSPEED;
};

// Obstacle.prototype.isOffscreen = function (field) {
//   // need to determine overlap
// };

module.exports = Obstacle;
