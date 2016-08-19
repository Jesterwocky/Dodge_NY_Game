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

  "#BE7C64"
];

function DodgeNyGame(canvas, fieldWidth, fieldHeight) {
  this.win = false;
  this.canvas = canvas;
  this.canvasContext = canvas.getContext("2d");
  this.fieldWidth = fieldWidth;
  this.fieldHeight = fieldHeight;
  this.obstacles = [];
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

  while (this.obstacles.length < 400) {
    this.spawnPeople();
  }

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
  let x = Math.floor(Math.random() * this.fieldWidth);
  let y = Math.floor(Math.random() * this.fieldHeight);

  let width = Math.floor((Math.random() * 50) + 10);
  let height = Math.floor((Math.random() * 50) + 5);

  while(this.inTheRoad(x + (width / 2))) {
    x = Math.floor(Math.random() * this.fieldWidth);
    y = Math.floor(Math.random() * this.fieldHeight);
  }

  // need to generate random size, too. And random color picked
  // from a list of colors

  let obstacle = new Obstacle({
    center: [x, y],
    width: width,
    height: height
  });

  this.obstacles.push(obstacle);
};

DodgeNyGame.prototype.spawnPeople = function() {
  let options = {};

  let x = Math.floor(Math.random() * this.fieldWidth);
  let y = Math.floor(Math.random() * this.fieldHeight);

  while (this.inTheRoad(x)) {
    // console.log(`X is ${x} and it's in the road (greater than ${this.fieldWidth / 3} and less than ${this.fieldWidth - (this.fieldWidth / 3)})`);
    x = Math.floor(Math.random() * this.fieldWidth);
    y = Math.floor(Math.random() * this.fieldHeight);
  }

  options.center = [x, y];
  options.direction = Math.random() <= 0.5 ? -1 : 1;
  options.color = HAIRCOLORS[Math.floor(Math.random() * HAIRCOLORS.length)];
  options.speed = Math.ceil(Math.random() * 4);
  options.drift = Math.floor(Math.random() * 2);
  options.driftDirection = Math.random() <= 0.5 ? -1 : 1;
  options.canCrossStreet = Math.random() <= 0.98 ? false : true;

  console.log(`${options.canCrossStreet}`);

  let obstacle = new MovingPerson(options);
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
