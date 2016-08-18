

function Player(canvas, startPos) {
  this.canvas = canvas;
  this.canvasContext = canvas.getContext("2d");
  this.pos = startPos;
  this.width = 10;
  this.height = 5;
  this.color = "#3F84D3";
}

Player.prototype.draw = function() {
  this.canvasContext.fillStyle = this.color;
  this.canvasContext.fillRect(
    this.pos[0],
    this.pos[1],
    this.width,
    this.height
  );
};

Player.prototype.moveUp = function() {
  //unless adding would make the player go outside
  // the screen bounds...
  this.pos[1] += 1;
};

Player.prototype.moveDown = function() {
  this.pos[1] -= 1;
};

Player.prototype.moveLeft = function() {
  this.pos[0] -= 1;
};

Player.prototype.moveRight = function() {
  this.pos[0] += 1;
};

module.exports = Player;
