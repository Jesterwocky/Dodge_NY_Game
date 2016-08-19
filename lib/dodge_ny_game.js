const Obstacle = require('./obstacle/obstacle.js');
const MovingObstacle = require('./obstacle/moving_obstacle/moving_obstacle.js');
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

  //Need to organize this better
  while (this.obstacles.length < 20) {
    this.spawnStaticObstacle();
  }

  while(this.obstacles.length < 200) {
    this.spawnMovingObstacle();
  }
};

DodgeNyGame.prototype.spawnStaticObstacle = function() {
  let x = Math.ceil(Math.random() * this.fieldWidth);
  let y = Math.ceil(Math.random() * this.fieldHeight);

  let width = Math.ceil(Math.random() * 50);
  let height = Math.ceil(Math.random() * 50);

  // need to generate random size, too. And random color picked
  // from a list of colors

  let obstacle = new Obstacle({
    center: [x, y],
    width: width,
    height: height
  });
  this.obstacles.push(obstacle);
};

DodgeNyGame.prototype.spawnMovingObstacle = function() {
  let x = Math.ceil(Math.random() * this.fieldWidth);
  let y = Math.ceil(Math.random() * this.fieldHeight);

  let direction = Math.random() <= 0.5 ? -1 : 1;

  let obstacle = new MovingObstacle({
    center: [x, y],
    direction: direction
  });
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
        console.log("move up");
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
  }, 200);
};

module.exports = DodgeNyGame;
