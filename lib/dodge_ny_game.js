const Obstacle = require('./obstacle/obstacle.js');
const MovingPerson = require('./obstacle/moving_obstacle/moving_person.js');
const Player = require('./player.js');
const Car = require('./obstacle/moving_obstacle/moving_cars.js');

const STARTPOS = [50, 450];
const CARCOLORS = [
  "#4C6B9E",
  "#4C6B9E",
  "#4C6B9E",
  "#4C6B9E",
  "#4C6B9E",

  "#000000",
  "#000000",
  "#000000",
  "#000000",

  "#F9FBF8",
  "#F9FBF8",
  "#F9FBF8",

  "#D11818",
  "#D11818",

  "#4D7F4C",
  "#4D7F4C",
];
const HAIRCOLORS = [
  "#0D0C0C",
  "#0D0C0C",
  "#0D0C0C",
  "#0D0C0C",
  "#0D0C0C",
  "#0D0C0C",
  "#0D0C0C",
  "#0D0C0C",
  "#0D0C0C",

  "#421E1E",
  "#421E1E",
  "#421E1E",
  "#421E1E",
  "#421E1E",
  "#421E1E",
  "#421E1E",
  "#421E1E",
  "#421E1E",
  "#421E1E",
  "#421E1E",
  "#421E1E",
  "#421E1E",
  "#421E1E",
  "#421E1E",

  "#87692F",
  "#87692F",
  "#87692F",
  "#87692F",
  "#87692F",

  "#D0CB33",

  "#BE7C64",

  "#E6E9E9"
];

function DodgeNyGame(canvas, fieldWidth, fieldHeight) {
  this.win = false;
  this.canvas = canvas;
  this.canvasContext = canvas.getContext("2d");
  this.fieldWidth = fieldWidth;
  this.fieldHeight = fieldHeight;
  this.obstacles = [];
  this.people = [];
  this.cars = [];
  this.player = new Player(canvas, STARTPOS);
}

DodgeNyGame.prototype.setUpField = function () {
  //can use this to set up next set to scroll in?
  //Need to have safeguards against what can be generated

  //Need to organize this better
  while (this.obstacles.length < 50) {
    this.spawnStaticObstacle();
  }

  while (this.people.length < 100) {
    this.spawnPeople(this.obstacles);
  }

  // Just have one function
  this.spawnCarsInRoad();
};

DodgeNyGame.prototype.inTheRoad = function(xVal) {
  // might want to use circles instead of squares/rectangles for most
  // moving objects
  return (
    xVal > (this.fieldWidth / 3) &&
    xVal < (this.fieldWidth - (this.fieldWidth / 3))
  );
};

// DodgeNyGame.prototype.roadFull = function() {
//   // check if the road has hit some limit for number of cars
//   return false;
// };

DodgeNyGame.prototype.spawnCarsInRoad = function() {
  this.cars.push(new Car({
    direction: -1,
    center: [
      (this.fieldWidth - (this.fieldWidth / 3)) - (3/8) * (this.fieldWidth - (this.fieldWidth / 3)),
      Math.floor(Math.random() * this.fieldHeight)
    ]
  }));

  this.cars.push(new Car({
    direction: 1,
    center: [
      (this.fieldWidth - (this.fieldWidth / 3)) - (3/16) * (this.fieldWidth - (this.fieldWidth / 3)),
      Math.floor(Math.random() * this.fieldHeight)
    ],
  }));
};

DodgeNyGame.prototype.spawnCarAtRoadStart = function() {

};

DodgeNyGame.prototype.spawnStaticObstacle = function() {
  this.obstacles.push(new Obstacle({
    topLeft: this.randomSidewalkPos(),
    width:   Math.floor((Math.random() * 50) + 10),
    height:  Math.floor((Math.random() * 50) + 5)
  }));
};

DodgeNyGame.prototype.spawnPeople = function(obstacles) {
  this.people.push(new MovingPerson({
    center:         this.randomSidewalkPos(),
    direction:      Math.random() <= 0.5 ? -1 : 1,
    color:          HAIRCOLORS[Math.floor(Math.random() * HAIRCOLORS.length)],
    speed:          Math.ceil(Math.random() * 4),
    drift:          Math.floor(Math.random() * 3),
    driftDirection: Math.random() <= 0.5 ? -1 : 1,
    obstacles:      obstacles,
    canCrossStreet: Math.random() <= 0.98 ? false : true,
    fearsRoad: Math.random() > 0.9 ? false : true
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

// Not DRY!
DodgeNyGame.prototype.intersectsAnyObstacle = function(pos) {
  collidesWith = this.findIntersectedObstacles(pos);

  if (collidesWith.length > 0) return true;
};

// Not DRY!
DodgeNyGame.prototype.findIntersectedObstacles = function(pos) {
  let collidesWith = [];

  for (let obstacle of this.obstacles) {
    if (this.intersectsObstacle(pos, obstacle)) {
      collidesWith.push(obstacle);
    }
  }

  return collidesWith;
};

// Not DRY!
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
  for (let car of this.cars) {
    if (car.isOffCanvas()) {}

    else {
      car.render(this.canvasContext);
    }
  }
};

DodgeNyGame.prototype.animate = function() {
  this.canvasContext.clearRect(0, 0, this.fieldWidth, this.fieldHeight);
  this.drawObstacles();
  this.drawCars();
  this.drawPeople();
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
