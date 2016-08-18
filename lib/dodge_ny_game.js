const Obstacle = require('./obstacle/obstacle.js');

function DodgeNyGame(canvasContext, fieldWidth, fieldHeight) {
  this.win = false;
  this.canvasContext = canvasContext;
  this.fieldWidth = fieldWidth;
  this.fieldHeight = fieldHeight;
  this.obstacles = [];
}

DodgeNyGame.prototype.setUpField = function () {
  //can use this to set up next set to scroll in?
  //Need to have safeguards against what can be generated
  while (this.obstacles.length < 1) {
    this.spawnObstacle();
  }
};

DodgeNyGame.prototype.spawnObstacle = function() {
  // need to generate random numbers here
  let x = Math.ceil(Math.random() * this.fieldWidth);
  let y = Math.ceil(Math.random() * this.fieldHeight);

  let obstacle = new Obstacle({center: [x, y]});
  this.obstacles.push(obstacle);
};

DodgeNyGame.prototype.draw = function() {
  for (let obstacle of this.obstacles) {
    obstacle.render(this.canvasContext);
  }
};

DodgeNyGame.prototype.animate = function() {
  this.canvasContext.clearRect(0, 0, this.fieldWidth, this.fieldHeight);
  this.draw();
  console.log("Animating");
};

DodgeNyGame.prototype.play = function() {
  this.setUpField();
  let that = this;

  setInterval(function () {
    that.animate();
  }, 200);
};

module.exports = DodgeNyGame;
