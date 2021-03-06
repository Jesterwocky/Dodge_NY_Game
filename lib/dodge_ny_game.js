const Obstacle = require('./obstacle/obstacle.js');
const MovingPerson = require('./obstacle/moving_obstacle/moving_person.js');
const Player = require('./player.js');
const Car = require('./obstacle/moving_obstacle/moving_cars.js');

const CARCOLORS = require('./dodge_ny_constants/carcolors.js');
const HAIRCOLORS = require('./dodge_ny_constants/haircolors.js');
const SHIRTCOLORS = require('./dodge_ny_constants/shirtcolors.js');
const SCOREBOARD = $("#game-info")[0];
const STARTPOS = [50, 460];

function DodgeNyGame(canvas, fieldWidth, fieldHeight) {
  this.gameOver = false;
  this.canvas = canvas;
  this.canvasContext = canvas.getContext("2d");
  this.fieldWidth = fieldWidth;
  this.fieldHeight = fieldHeight;
  this.obstacles = [];
  this.people = [];
  this.cars = [];
  this.leftLaneTicker = 6;
  this.rightLaneTicker = 3;
}

DodgeNyGame.prototype.setUpField = function () {
  while (this.obstacles.length < 30) {
    this.spawnStaticObstacle();
  }

  while (this.people.length < 300) {
    this.spawnPerson(this.obstacles);
  }

  this.player = new Player(this.canvas, STARTPOS, this.obstacles, this.people);

  this.spawnCarsInRoad();
};

DodgeNyGame.prototype.inTheRoad = function(xVal) {
  return (
    xVal > (this.fieldWidth / 3) &&
    xVal < (this.fieldWidth - (this.fieldWidth / 3))
  );
};

DodgeNyGame.prototype.spawnCarsInRoad = function() {
  this.cars.push(new Car({
    color: CARCOLORS[Math.floor(Math.random() * CARCOLORS.length)],
    direction: -1,
    topLeft: [
      Math.floor((this.fieldWidth - 15 - (this.fieldWidth / 3)) - (3/8) * (this.fieldWidth - (this.fieldWidth / 3))),
      Math.floor(Math.random() * this.fieldHeight)
    ]
  }));

  this.cars.push(new Car({
    color: CARCOLORS[Math.floor(Math.random() * CARCOLORS.length)],
    direction: 1,
    topLeft: [
      Math.floor((this.fieldWidth - 5 - (this.fieldWidth / 3)) - (3/16) * (this.fieldWidth - (this.fieldWidth / 3))),
      Math.floor(Math.random() * this.fieldHeight)
    ],
  }));
};

DodgeNyGame.prototype.spawnStaticObstacle = function() {
  this.obstacles.push(new Obstacle(this.randomObstacleOptions()));
};

DodgeNyGame.prototype.randomObstacleOptions = function() {
  let width = Math.floor((Math.random() * 50) + 10);
  let height = Math.floor((Math.random() * 50) + 5);

  let topLeft = this.randomSidewalkPos();

  while (this.inTheRoad(topLeft) ||
    this.inTheRoad([topLeft[0] + width - 10, topLeft[1]]) ||
      this.overlapsStartPoint(topLeft, width, height)) {
        topLeft = this.randomSidewalkPos();
      }

  return ({
    width: width,
    height: height,
    topLeft: topLeft
  });
};

DodgeNyGame.prototype.overlapsStartPoint = function(topLeft, width, height) {
  let leftX = topLeft[0];
  let rightX = leftX + width;
  let topY = topLeft[1];
  let bottomY = topY + height;

  if (STARTPOS[0] >= leftX && STARTPOS[0] <= rightX && STARTPOS[1] >= topY && STARTPOS[1] <= bottomY) {
    return true;
  }
};

DodgeNyGame.prototype.spawnPerson = function(obstacles) {
  this.people.push(new MovingPerson({
    center:         this.randomSidewalkPos(),
    direction:      Math.random() <= 0.5 ? -1 : 1,
    hairColor:      HAIRCOLORS[Math.floor(Math.random() * HAIRCOLORS.length)],
    shirtColor:      SHIRTCOLORS[Math.floor(Math.random() * HAIRCOLORS.length)],
    speed:          Math.ceil(Math.random() * (5 - 0.5) + 0.5),
    drift:          Math.floor(Math.random() * (3 - 1) + 1),
    driftDirection: Math.random() <= 0.5 ? -1 : 1,
    obstacles:      obstacles,
    canCrossStreet: Math.random() <= 0.98 ? false : true,
    fearsRoad:      Math.random() > 0.9 ? false : true
  }));
};

DodgeNyGame.prototype.randomSidewalkPos = function() {
  let y = Math.floor(Math.random() * this.fieldHeight);
  let x = Math.floor(Math.random() * this.fieldWidth);

  while (this.inTheRoad(x) || this.intersectsAnyObstacle([x, y])) {
    x = Math.floor(Math.random() * this.fieldWidth);
  }

  return [x, y];
};

DodgeNyGame.prototype.intersectsAnyObstacle = function(pos) {
  collidesWith = this.findIntersectedObstacles(pos);

  if (collidesWith.length > 0) return true;
};

DodgeNyGame.prototype.findIntersectedObstacles = function(pos) {
  let collidesWith = [];

  for (let obstacle of this.obstacles) {
    if (this.intersectsObstacle(pos, obstacle)) {
      collidesWith.push(obstacle);
    }
  }

  return collidesWith;
};

DodgeNyGame.prototype.intersectsObstacle = function(pos, obstacle) {
  let xIntersection = (pos[0] >= obstacle.leftX && pos[0] <= obstacle.rightX);
  let yIntersection = (pos[1] >= obstacle.topY && pos[1] <= obstacle.bottomY);

  if (xIntersection && yIntersection) return true;
};

DodgeNyGame.prototype.drawObstacles = function() {
  for (let obstacle of this.obstacles) {
    obstacle.render(this.canvasContext);
  }
};

DodgeNyGame.prototype.drawPeople = function() {
  for (let person of this.people) {
    person.render(this.canvasContext);
  }
};

DodgeNyGame.prototype.drawCars = function() {
  if (this.cars.length > 0) {

    for (let car of this.cars) {
      car.render(this.canvasContext);
    }
  }
};

DodgeNyGame.prototype.animate = function() {
  this.canvasContext.clearRect(0, 0, this.fieldWidth, this.fieldHeight);
  this.drawObstacles();
  this.evalCarTicker();
  this.drawCars();
  this.drawPeople();

  this.player.cars = this.cars;
  this.player.draw();

  if (this.player.reachedDestination()) {
    this.gameOver = true;
    clearInterval(this.intervalId);
    //render text
    this.canvasContext.font = "90px Vibur, sans-serif";
    this.canvasContext.fillStyle = "#FFFFFF";
    this.canvasContext.fillText(
      `You made it!!!`,
      20, 250
    );

    $(document).one("keypress", function () {
      this.reset();
    });
  }
};

DodgeNyGame.prototype.discardCarsOffCanvas = function() {
  if (this.cars.length > 0) {
    let carsInTheGame = [];

    for (let car of this.cars) {
      if (!car.isOffCanvas) {
        carsInTheGame.push(car);
      }
    }

    this.cars = carsInTheGame;
  }
};


DodgeNyGame.prototype.evalCarTicker = function() {
  if (this.leftLaneTicker <= 0) {
    this.spawnLeftLaneCar();
    let wildcard = Math.random() >= 0.8 ? 10 : 0;
    this.leftLaneTicker = Math.ceil(Math.random() * 8) + 5 + wildcard;
  }

  if (this.rightLaneTicker <= 0) {
    this.spawnRightLaneCar();
    let wildcard = Math.random() >= 0.8 ? 10 : 0;
    this.rightLaneTicker = Math.ceil(Math.random() * 5) + 5 + wildcard;
  }
};

DodgeNyGame.prototype.spawnLeftLaneCar = function() {
  this.cars.push(new Car({
    direction: -1,
    color: CARCOLORS[Math.floor(Math.random() * CARCOLORS.length)],
    speed: 30 + Math.floor(Math.random() * 8),
    topLeft: [
      (this.fieldWidth - 15 - (this.fieldWidth / 3)) - (3/8) * (this.fieldWidth - (this.fieldWidth / 3)),
      this.fieldHeight - 3
    ]
  }));
};

DodgeNyGame.prototype.spawnRightLaneCar = function() {
  this.cars.push(new Car({
    direction: 1,
    color: CARCOLORS[Math.floor(Math.random() * CARCOLORS.length)],
    speed: 30 + Math.floor(Math.random() * 8),
    topLeft: [
      (this.fieldWidth - 5 - (this.fieldWidth / 3)) - (3/16) * (this.fieldWidth - (this.fieldWidth / 3)),
      -72
    ],
  }));
};

DodgeNyGame.prototype.play = function() {
  SCOREBOARD.innerHTML = "Patience <p id='score'></p>";

  const instructionsSection = $("#instructions-overlay")[0];
  instructionsSection.innerHTML = "";

  this.setUpField();

  let that = this;
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
  });

  this.intervalId = setInterval(function () {
    that.leftLaneTicker -= 1;
    that.rightLaneTicker -= 1;
    that.animate();
  }, 150);
};

DodgeNyGame.prototype.reset = function() {
  this.gameOver = false;
  this.canvas = canvas;
  this.canvasContext = canvas.getContext("2d");
  this.obstacles = [];
  this.people = [];
  this.cars = [];
  this.leftLaneTicker = 6;
  this.rightLaneTicker = 3;

  this.player = undefined;

  this.setUpField();

  this.intervalId = setInterval(function () {
    that.leftLaneTicker -= 1;
    that.rightLaneTicker -= 1;
    that.animate();
  }, 120);
};

module.exports = DodgeNyGame;
