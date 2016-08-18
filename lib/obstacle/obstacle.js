const SCROLLSPEED = 1;

function Obstacle(options = {}) {
  defaults = {
    center: [0, 100],
    width: 10,
    height: 10,
    color: "#5F3E3E",
  };

  Object.assign(defaults, options);

  this.center = defaults.center;
  this.width = defaults.width;
  this.height = defaults.height;
  this.color = defaults.color;
}

Obstacle.prototype.render = function (canvasContext) {
  this.draw(canvasContext);
  this.scroll();
};

Obstacle.prototype.draw = function (canvasContext) {
  canvasContext.fillStyle = this.color;
  canvasContext.fillRect(
    this.center[0],
    this.center[1],
    this.width,
    this.height
  );
};

Obstacle.prototype.isOffCanvas = function () {
  return false;
};

Obstacle.prototype.scroll = function () {
  this.center[1] += SCROLLSPEED;
};

module.exports = Obstacle;
