const Obstacle = require('./obstacle/obstacle.js');
const Player = require('./player.js');

const STARTPOS = [50, 450];

function DodgeNyGame(canvas, fieldWidth, fieldHeight) {
  this.win = false;
  this.canvas = canvas;
  this.canvasContext = canvas.getContext("2d");
  this.fieldWidth = fieldWidth;
  this.fieldHeight = fieldHeight;
  this.obstacles = [];
  this.player = new Player(canvas, STARTPOS);
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

DodgeNyGame.prototype.drawObstacles = function() {
  for (let obstacle of this.obstacles) {
    if (obstacle.isOffCanvas()) {}

    else {
      obstacle.render(this.canvasContext);
    }
  }
};

DodgeNyGame.prototype.animate = function() {
  this.canvasContext.clearRect(0, 0, this.fieldWidth, this.fieldHeight);
  this.drawObstacles();
  this.player.draw();
  console.log("Animating");
};

DodgeNyGame.prototype.discardOffCanvas = function() {

};

DodgeNyGame.prototype.play = function() {
  this.setUpField();

  let that = this;
  // Is this the right place to add this
  // event handler?
  $(document).on("keydown", function(e) {
    switch (e.which) {
      case 37:
        that.player.moveLeft();
        break;
      case 40:
        that.player.moveUp();
        break;
      case 39:
        that.player.moveRight();
        break;
      case 38:
        that.player.moveDown();
        break;
    }

    console.log(e.which);
  });


  setInterval(function () {
    that.animate();
  }, 20);
};

module.exports = DodgeNyGame;
