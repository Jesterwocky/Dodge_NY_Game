const SCROLLSPEED = 1;

function Obstacle(options = {}) {
  defaults = {
    width: 10,
    height: 10,
    topLeft: [0, 100],
    bottomLeft: [0, 100 + 10],
    topRight: [0 + 10, 100],
    bottomRight: [0 + 10, 100 + 10],
    color: "#7d9092"
  };

  Object.assign(defaults, options);
  this.width   = defaults.width;
  this.height  = defaults.height;
  this.color = defaults.color;

  this.leftX   = defaults.topLeft[0];
  this.rightX  = this.leftX + this.width;
  this.topY    = defaults.topLeft[1];
  this.bottomY = this.topY + this.height;

  this.topLeft = defaults.topLeft;
  this.bottomLeft = [this.leftX, this.bottomY];
  this.topRight = [this.rightX, this.topY];
  this.bottomRight = [this.rightX, this.bottomY];
}

Obstacle.prototype.render = function (canvasContext) {
  this.draw(canvasContext);
  // this.scroll();
};

Obstacle.prototype.draw = function (canvasContext) {
  canvasContext.fillStyle = this.color;
  canvasContext.fillRect(
    this.topLeft[0],
    this.topLeft[1],
    this.width,
    this.height
  );
};

Obstacle.prototype.isOffCanvas = function () {
  return false;
};

Obstacle.prototype.scroll = function () {
  this.topLeft[1] += SCROLLSPEED;
};

module.exports = Obstacle;
