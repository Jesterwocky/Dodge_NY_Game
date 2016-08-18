const Obstacle = require('obstacle/obstacle.js');

function DodgeNyGame(fieldWidth, fieldHeight) {
  this.fieldWidth = fieldWidth;
  this.fieldHeight = fieldHeight;
  this.obstacles = [];
}

DodgeNyGame.prototype.spawnObstacle = function() {
  // need to generate random numbers here
  let x = 0;
  let y = 0;

  let obs = new Obstacle({center: [x, y]});
  this.obstacles.push(obs);
};

DodgeNYGame.prototype.setUpField = function () {
  //can use this to set up next set to scroll in?
  
};

DodgeNYGame.prototype.draw = function(canvasContext) {
  canvasContext.clearRect(0, 0, this.fieldWidth, this.fieldHeight);
  for (let obstacle in this.obstacles) {
    obstacle.draw(canvasContext);
  }
};
