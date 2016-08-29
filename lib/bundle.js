/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DodgeNyGame = __webpack_require__(1);
	
	const HEIGHT = 500;
	const WIDTH = 500;
	
	const STARTPOS = [50, 460];
	
	document.addEventListener("DOMContentLoaded", function() {
	  // Background
	  const backgroundCanvas  = document.getElementById("background-canvas");
	  backgroundCanvas.height = HEIGHT;
	  backgroundCanvas.width  = WIDTH;
	  let backgroundContext   = backgroundCanvas.getContext("2d");
	
	  backgroundContext.fillStyle = "#E4E2DC";
	  backgroundContext.fillRect(0, 0, WIDTH, HEIGHT);
	  backgroundContext.fillStyle = "#C6C6C6";
	  backgroundContext.fillRect((WIDTH / 3), 0, (WIDTH / 3), HEIGHT);
	  // subway exit
	  backgroundContext.fillStyle = "#C2BEB7";
	  backgroundContext.fillRect(35, 405, 30, 70);
	  //destination
	  backgroundContext.fillStyle = "#1DB31D";
	  backgroundContext.fillRect((WIDTH - 30), 0, 30, 30);
	
	  // Foreground
	  const foregroundCanvas        = document.getElementById("foreground-canvas");
	  foregroundCanvas.height       = HEIGHT;
	  foregroundCanvas.width        = WIDTH;
	  // const foregroundCanvasContext = foregroundCanvas.getContext("2d");
	  // foregroundCanvasContext.font  = "20px Vibur, sans-serif";
	  // foregroundCanvasContext.fillStyle = "#FFFFFF";
	  // foregroundCanvasContext.fillText(
	  //   `Get from the subway to work (green square)
	  //   without losing your cool.
	  //   Press any key to start.
	  //   You're the one in red.
	  //   Good luck!`,
	  //   20, 250
	  // );
	  const instructionsSection = $("#instructions-overlay")[0];
	  instructionsSection.innerHTML =
	    "Get from the subway to work (green square) without losing your cool. <br/> <br/> Press any key to start. You're the one in red. <br/> <br/> Good luck!";
	
	  let game = new DodgeNyGame(foregroundCanvas, WIDTH, HEIGHT);
	
	  const scoreBoard = $("#game-info")[0];
	  scoreBoard.innerHTML = "Welcome to New York! Press any key to play";
	
	  $(document).one("keypress", function () {
	    game.play();
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Obstacle = __webpack_require__(2);
	const MovingPerson = __webpack_require__(3);
	const Player = __webpack_require__(4);
	const Car = __webpack_require__(5);
	
	const CARCOLORS = __webpack_require__(6);
	const HAIRCOLORS = __webpack_require__(7);
	const SHIRTCOLORS = __webpack_require__(8);
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
	  //can use this to set up next set to scroll in?
	  //Need to have safeguards against what can be generated
	
	  while (this.obstacles.length < 30) {
	    this.spawnStaticObstacle();
	  }
	
	  while (this.people.length < 400) {
	    this.spawnPerson(this.obstacles);
	  }
	
	  this.player = new Player(this.canvas, STARTPOS, this.obstacles, this.people);
	
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
	    speed:          Math.ceil(Math.random() * 4),
	    drift:          Math.floor(Math.random() * 3),
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
	  // this.discardCarsOffCanvas();
	
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
	  SCOREBOARD.innerHTML = "Politeness Points <p id='score'></p>";
	
	  const instructionsSection = $("#instructions-overlay")[0];
	  instructionsSection.innerHTML = "";
	
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
	  }, 150);
	};
	
	module.exports = DodgeNyGame;


/***/ },
/* 2 */
/***/ function(module, exports) {

	const SCROLLSPEED = 1;
	
	function Obstacle(options = {}) {
	  defaults = {
	    width: 10,
	    height: 10,
	    topLeft: [0, 100],
	    bottomLeft: [0, 100 + 10],
	    topRight: [0 + 10, 100],
	    bottomRight: [0 + 10, 100 + 10],
	    color: "#A7B6B8",
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const Obstacle = __webpack_require__(2);
	const DodgeNyGame = __webpack_require__(1);
	
	// NOT DRY!!
	const FIELDWIDTH = 500;
	const FIELDHEIGHT = 500;
	
	function MovingPerson(options) {
	  defaults = {
	    center: [0, 100],
	    width: 10,
	    height: 10,
	    hairColor: "#5F3E3E",
	    shirtColor: "#463D3D",
	    direction: -1,
	    speed: 1,
	    drift: 2,
	    driftDirection: -1,
	    fearsRoad: true,
	    canCrossStreet: false,
	    obstacles: [],
	
	    vectors: [[0.6, -0.6], [-0.6, -0.6]]
	  };
	
	  Object.assign(defaults, options);
	
	  // Use this to DRY up code.
	  // Obstacle.call(this, defaults);
	
	  this.center = defaults.center;
	  this.width = defaults.width;
	  this.height = defaults.height;
	  this.hairColor = defaults.hairColor;
	  this.shirtColor = defaults.shirtColor;
	  this.direction = defaults.direction;
	  this.speed = defaults.speed;
	  this.drift = defaults.drift;
	  this.driftDirection = defaults.driftDirection;
	  this.fearsRoad = defaults.fearsRoad;
	  this.canCrossStreet = defaults.canCrossStreet;
	  this.obstacles = defaults.obstacles;
	  this.moveOffRoadEastVectors = [[3, 1], [3, -1]];
	  this.moveOffRoadWestVectors = [[-3, 1], [-3, -1]];
	
	  let vectors = [];
	  for (let vector of defaults.vectors) {
	    vectors.push([
	      (vector[0] * defaults.speed) + (defaults.drift * defaults.driftDirection),
	      vector[1] * defaults.speed * this.direction
	    ]);
	  }
	
	  this.vectors = vectors;
	}
	
	function Surrogate() {}
	Surrogate.prototype = Obstacle.prototype;
	this.prototype = new Surrogate();
	this.prototype.constructor = this;
	
	// Shouldn't need this; should inherit
	MovingPerson.prototype.isOffCanvas = function (xVal) {
	  return (xVal <= 0 || xVal >= FIELDWIDTH);
	};
	
	// Not DRY!!
	MovingPerson.prototype.inTheRoad = function(xVal) {
	  return (
	    xVal >= (FIELDWIDTH / 3) + 15 &&
	    xVal <= (FIELDWIDTH - (FIELDWIDTH / 3)) - 15
	  );
	};
	
	MovingPerson.prototype.move = function() {
	  let originalCenter = this.center.slice();
	
	  let vectors = this.vectors;
	
	  let wronglyInRoad = !this.canCrossStreet && this.inTheRoad(this.center[0] + vectors[0][0]);
	
	  if (wronglyInRoad) {
	    if (this.distance(this.center, [FIELDWIDTH - (FIELDWIDTH / 3), this.center[1]]) <
	        this.distance(this.center, [(FIELDWIDTH / 3), this.center[1]])
	    ) {
	      vectors = this.moveOffRoadEastVectors;
	    }
	
	    else {
	      vectors = this.moveOffRoadWestVectors;
	    }
	  }
	
	  let movement = vectors.shift();
	
	  this.center[0] = (this.center[0] + movement[0]);
	  let newY = this.center[1] + movement[1];
	  this.center[1] = (newY > 0) ? Math.floor(newY % FIELDHEIGHT) : FIELDHEIGHT - 1;
	
	  vectors.push(movement);
	
	  if (this.intersectsAnyObstacle(this.center)) {
	    // this.randomlyChangeDrift();
	    let startingPoint = this.center.slice();
	    this.handleIntersections(originalCenter, startingPoint);
	  }
	
	  wronglyInRoad = !this.canCrossStreet && this.inTheRoad(this.center[0] + vectors[0][0]);
	  let outtaBounds = this.isOffCanvas(this.center[0] + vectors[0][0]);
	  // let avoidingRoad = (!wronglyInRoad && this.fearsRoad && this.inTheRoad(this.center[0] + 30, this.center[1])) ||
	  //   (!wronglyInRoad && this.fearsRoad && this.inTheRoad(this.center[0] - 30, this.center[1]));
	  // let closeToSide = this.center[0] <= 30 && this.driftDirection < 1 ||
	  //   this.center[0] >= FIELDHEIGHT - 30 && this.driftDirection > 1;
	
	  if (outtaBounds || wronglyInRoad) {
	    this.changeDrift();
	  }
	
	  this.collidesWith = [];
	  // this.randomlyChangeDrift();
	};
	
	MovingPerson.prototype.intersectsAnyObstacle = function(pos) {
	  this.findIntersectedObstacles(pos);
	
	  if (this.collidesWith.length > 0) return true;
	};
	
	MovingPerson.prototype.findIntersectedObstacles = function(pos) {
	  let collidesWith = [];
	
	  for (let obstacle of this.obstacles) {
	    if (this.intersectsObstacle(pos, obstacle)) {
	      collidesWith.push(obstacle);
	    }
	  }
	
	  this.collidesWith = collidesWith;
	};
	
	MovingPerson.prototype.intersectsObstacle = function(pos, obstacle) {
	  let xIntersection = (pos[0] >= obstacle.leftX && pos[0] <= obstacle.rightX);
	  let yIntersection = (pos[1] >= obstacle.topY && pos[1] <= obstacle.bottomY);
	
	  if (xIntersection && yIntersection) return true;
	};
	
	MovingPerson.prototype.handleIntersections = function(pos1, pos2) {
	  // object with keys "horizontal" and "vertical"
	  let collidedSides = this.collidedSides(pos1, pos2);
	
	  let horizontalBarrier = collidedSides.horizontal;
	  let verticalBarrier = collidedSides.vertical;
	
	  // This is happening sometimes on corners
	  if (horizontalBarrier.length === 0 && verticalBarrier.length === 0) {
	    this.randomlyChangeDirection();
	    return;
	  }
	
	  let newCenter;
	
	  // If person intersects any horizontal barrier...
	  if (horizontalBarrier.length > 0) {
	    // reflect: just use the X of pos2 and the Y of pos1
	    newCenter = [pos2[0], pos1[1]];
	  }
	
	  // If person intersects any vertical barrier...
	  if (verticalBarrier.length > 0) {
	    // if there was a horizontal intersection that resulted in a new center...
	    if (newCenter !== undefined) {
	      // need to make sure the person wasn't deflected back to the exact same
	      // position, otherwise this.collisionPoint will return [NaN, NaN]
	      if (!(pos1[0] === newCenter[0] && pos1[1] === newCenter[1])) {
	        let collisionPoint = this.collisionPoint([pos1, newCenter], verticalBarrier);
	        // New points or old, they'll still collide because the X val is the
	        // same as pos2, so no need to check
	        newCenter = [collisionPoint[0], (pos1[1] - (collisionPoint[1] - pos1[1]))];
	        // Should go in OPPOSITE direction for a bit and then resume normal motion.
	        // "false" flag lets us know to discard instead of push to end
	      }
	      this.randomlyChangeDirection();
	    }
	
	    else {
	      newCenter = [pos2[0], pos1[1]];
	    }
	  }
	
	  this.center = newCenter;
	};
	
	MovingPerson.prototype.collidedSides = function(pos1, pos2) {
	  let collidedSides = { horizontal: [], vertical: [] };
	
	  for (let obstacle of this.collidesWith) {
	    let sides = [
	      //horizontal
	      [obstacle.topLeft, obstacle.topRight],
	      [obstacle.bottomLeft, obstacle.bottomRight],
	      //vertical
	      [obstacle.topLeft, obstacle.bottomLeft],
	      [obstacle.topRight, obstacle.bottomRight]
	    ];
	
	    for (let side of sides) {
	      if (this.collide([pos1, pos2], side)) {
	
	        // if Y is equal for both points, i.e., line is horizontal
	        if (side[0][1] === side[1][1]) {
	          // if horizontal list is empty or pos1 is nearer to this side,
	          // horizontal side is this side
	          if (collidedSides.horizontal.length < 1 ||
	            this.distance(pos1, [pos1[0], side[0][1]]) <
	              this.distance(pos1, [pos1[0], collidedSides.horizontal[0][1]])) {
	                collidedSides.horizontal = side;
	              }
	        }
	
	        // else if line is vertical
	        else {
	          if (collidedSides.vertical.length < 1 ||
	            this.distance(pos1, [side[0][0], pos1[1]]) <
	              this.distance(pos1, [collidedSides.vertical[0][0], pos1[0]])) {
	                collidedSides.vertical = side;
	              }
	        }
	      }
	    }
	  }
	
	  return collidedSides;
	};
	
	MovingPerson.prototype.randomlyChangeDirection = function() {
	  this.direction = Math.random() <= 0.5 ? -1 : 1;
	  this.drift = Math.ceil(Math.random() * 3);
	  this.driftDirection = Math.random() <= 0.5 ? -1 : 1;
	
	  let vectors = [[1, -1], [-1, -1]];
	
	  for (let vector of vectors) {
	    vector[0] = (vector[0] * this.speed) + (this.drift * this.driftDirection);
	    vector[1] = (vector[1] * this.speed * this.direction);
	  }
	
	  this.vectors = vectors;
	};
	
	MovingPerson.prototype.randomlyChangeDrift = function() {
	  this.drift = Math.floor(Math.random() * 3);
	  this.driftDirection = Math.random() <= 0.5 ? -1 : 1;
	
	  let vectors = [[1, -1], [-1, -1]];
	
	  for (let vector of vectors) {
	    vector[0] = (vector[0] * this.speed) + (this.drift * this.driftDirection);
	    vector[1] = (vector[1] * this.speed * this.direction);
	  }
	
	  this.vectors = vectors;
	};
	
	MovingPerson.prototype.distance = function(pos1, pos2) {
	  return Math.floor(Math.sqrt(Math.pow(pos2[0] - pos1[0], 2) + Math.pow(pos2[1] - pos1[1], 2)));
	};
	
	MovingPerson.prototype.collide = function(endPoints1, endPoints2) {
	  let pos1 = endPoints1[0];
	  let pos2 = endPoints1[1];
	
	  // If X vals are the same for both points, i.e., side is vertical
	  if (endPoints2[0][0] === endPoints2[1][0]) {
	    if (
	      pos1[0] <= endPoints2[0][0] && pos2[0] >= endPoints2[0][0] ||
	      pos2[0] <= endPoints2[0][0] && pos1[0] >= endPoints2[0][0]
	    ) {
	      if (pos2[1] >= endPoints2[0][1] && pos2[1] <= endPoints2[1][1]) {
	        return true;
	      }
	    }
	  }
	  // if side is horizontal
	  else {
	    if (
	      pos1[1] <= endPoints2[0][1] && pos2[1] >= endPoints2[0][1] ||
	      pos2[1] <= endPoints2[0][1] && pos1[1] >= endPoints2[0][1]
	    ) {
	      if (pos2[0] >= endPoints2[0][0] && pos2[0] <= endPoints2[1][0]) {
	        return true;
	      }
	    }
	  }
	};
	
	MovingPerson.prototype.collisionPoint = function(pointPair1, pointPair2) {
	  let x1 = pointPair1[0][0];
	  let y1 = pointPair1[0][1];
	  let x2 = pointPair1[1][0];
	  let y2 = pointPair1[1][1];
	
	  let x3 = pointPair2[0][0];
	  let y3 = pointPair2[0][1];
	  let x4 = pointPair2[1][0];
	  let y4 = pointPair2[1][1];
	
	  let xIntersect = ((((x1 * y2) - (y1 * x2)) * (x3 - x4)) - ((x1 - x2) * ((x3 * y4) - (y3 * x4)))) /
	                   (((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4)));
	
	  let yIntersect = ((((x1 * y2) - (y1 * x2)) * (y3 - y4)) - ((y1 - y2) * ((x3 * y4) - (y3 * x4)))) /
	                   (((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4)));
	
	  if (xIntersect != xIntersect || yIntersect != yIntersect) {
	  }
	  return ([xIntersect, yIntersect]);
	};
	
	MovingPerson.prototype.changeDrift = function() {
	  this.driftDirection *= -1;
	
	  let vectors = [];
	
	  for (let vector of this.vectors) {
	    vectors.push([
	      (vector[0]) * this.driftDirection,
	      vector[1]
	    ]);
	  }
	
	  this.vectors = vectors;
	};
	
	MovingPerson.prototype.render = function (canvasContext) {
	  this.draw(canvasContext);
	  this.move();
	};
	
	
	MovingPerson.prototype.shoulderPoints = function() {
	  // Need the AVERAGE of the next two vectors
	  let currentAverageVector = [
	    (this.vectors[0][0] + this.vectors[1][0]) / 2,
	    (this.vectors[0][1] + this.vectors[1][1]) / 2
	  ];
	
	  let perpendicularVector = [
	    -1 * currentAverageVector[1],
	    currentAverageVector[0]
	  ];
	  // find the should end points with this formula:
	  // original point +/- [
	  // distance from midpoint to shoulder * normalized vector[0],
	  // distance from midpoint to shoulder * normalized vector[0]
	  let totalShoulderWidth = this.width + 2;
	  let midpointToShoulder = totalShoulderWidth / 2;
	
	  let magnitude = Math.sqrt(Math.pow(perpendicularVector[0], 2) + Math.pow(perpendicularVector[1], 2));
	  let normalizedVector = [
	    perpendicularVector[0] / magnitude,
	    perpendicularVector[1] / magnitude
	  ];
	
	  let shoulderPointOne = [
	    this.center[0] + (midpointToShoulder * normalizedVector[0]),
	    this.center[1] + (midpointToShoulder * normalizedVector[1])
	  ];
	
	  let shoulderPointTwo = [
	    this.center[0] - (midpointToShoulder * normalizedVector[0]),
	    this.center[1] - (midpointToShoulder * normalizedVector[1])
	  ];
	
	  return [shoulderPointOne, shoulderPointTwo];
	};
	
	// Shouldn't need this; should inherit
	MovingPerson.prototype.draw = function (canvasContext) {
	  let shoulderPoints = this.shoulderPoints();
	  let shoulder1 = shoulderPoints[0];
	  let shoulder2 = shoulderPoints[1];
	
	  canvasContext.beginPath();
	  canvasContext.strokeStyle = this.shirtColor;
	  canvasContext.lineWidth   = 6;
	  canvasContext.lineCap     = "round";
	  canvasContext.moveTo(shoulder1[0], shoulder1[1]);
	  canvasContext.lineTo(shoulder2[0], shoulder2[1]);
	  canvasContext.stroke();
	
	  canvasContext.beginPath();
	  canvasContext.arc(
	    this.center[0],
	    this.center[1],
	    (this.width / 2) - 0.2,
	    0,
	    2 * Math.PI,
	    false
	  );
	  canvasContext.fillStyle = this.hairColor;
	  canvasContext.fill();
	};
	
	module.exports = MovingPerson;


/***/ },
/* 4 */
/***/ function(module, exports) {

	// NOT DRY!!
	const FIELDWIDTH = 500;
	const FIELDHEIGHT = 500;
	const DESTINATION = 30;
	
	const STARTPOS = [50, 460];
	
	function Player(canvas, startPos, obstacles, otherPeople) {
	  this.canvas = canvas;
	  this.canvasContext = canvas.getContext("2d");
	  this.pos = startPos;
	  this.obstacles = obstacles;
	  this.otherPeople = otherPeople;
	  this.width = 10;
	  this.height = 5;
	  this.hairColor = "#FF1919";
	  this.shirtColor = "black";
	  this.politenessPoints = 100;
	  this.scoreCard = $("#score")[0];
	  this.cars = [];
	  this.vector = [[1, 1]];
	}
	
	Player.prototype.draw = function () {
	  if (this.intersectsPeople()) {
	    this.getShoved();
	  }
	
	  if (this.hitByCar()) {
	    this.pos = STARTPOS;
	  }
	
	  this.canvasContext.beginPath();
	  this.canvasContext.arc(
	    this.pos[0],
	    this.pos[1],
	    this.width / 2,
	    0,
	    2 * Math.PI,
	    false
	  );
	  this.canvasContext.fillStyle = this.hairColor;
	  this.canvasContext.fill();
	  this.scoreCard.innerHTML = this.politenessPoints;
	};
	
	Player.prototype.intersectsPeople = function() {
	  for (let person of this.otherPeople) {
	    if (this.distance(this.pos, person.center) <= (this.width / 2) + (person.width / 2)) {
	      return true;
	    }
	  }
	};
	
	Player.prototype.getShoved = function() {
	  let xDistance = Math.floor(Math.random() * 10);
	  let xDirection = Math.random() <= 0.5 ? -1 : 1;
	
	  let yDistance = Math.floor(Math.random() * 5);
	  let yDirection = Math.random() <= 0.5 ? -1 : 1;
	
	  let newX = this.pos[0] + (xDistance * xDirection);
	  let newY = this.pos[1] + (yDistance * yDirection);
	
	  if (!this.intersectsAnyObstacle([newX, newY]) && this.inBounds([newX, newY])) {
	    this.pos = [newX, newY];
	  }
	
	  this.politenessPoints -= 1;
	};
	
	//Not DRY!
	Player.prototype.distance = function(pos1, pos2) {
	  return Math.floor(Math.sqrt(Math.pow(pos2[0] - pos1[0], 2) + Math.pow(pos2[1] - pos1[1], 2)));
	};
	
	Player.prototype.inBounds = function(pos) {
	  if (pos[0] <= FIELDWIDTH && pos[0] >= 0 && pos[1] <= FIELDHEIGHT && pos[1] >= 0) {
	    return true;
	  }
	
	  return false;
	};
	
	
	// NOT DRY!
	Player.prototype.inTheRoad = function() {
	  // might want to use circles instead of squares/rectangles for most
	  // moving objects
	  return (
	    this.pos[0] > (FIELDWIDTH / 3) &&
	    this.pos[0] < (FIELDWIDTH - (FIELDWIDTH / 3))
	  );
	};
	
	Player.prototype.hitByCar = function() {
	  for (let car of this.cars) {
	    if (this.intersectsObstacle(this.pos, car)) {
	      return true;
	    }
	  }
	};
	
	Player.prototype.moveIfValid = function(newPos) {
	  if (this.inBounds(newPos) && !this.intersectsAnyObstacle(newPos)) {
	    // this.vector = [this.newPos[0] - this.pos[0], ];
	    this.pos = newPos;
	  }
	};
	
	// NOT DRY!
	Player.prototype.intersectsAnyObstacle = function(pos) {
	  for (let obstacle of this.obstacles) {
	    if (this.intersectsObstacle(pos, obstacle)) {
	      return true;
	    }
	  }
	
	  return false;
	};
	
	// NOT DRY!
	Player.prototype.intersectsObstacle = function(pos, obstacle) {
	  let xIntersection = (pos[0] >= obstacle.leftX && pos[0] <= obstacle.rightX);
	  let yIntersection = (pos[1] >= obstacle.topY && pos[1] <= obstacle.bottomY);
	
	  if (xIntersection && yIntersection) return true;
	};
	
	Player.prototype.moveUp = function() {
	  let moveVal = 1;
	  if (this.inTheRoad()) {
	    moveVal = 4;
	  }
	
	  this.moveIfValid([this.pos[0], this.pos[1] + moveVal]);
	};
	
	Player.prototype.moveDown = function() {
	  let moveVal = 1;
	  if (this.inTheRoad()) {
	    moveVal = 4;
	  }
	
	  this.moveIfValid([this.pos[0], this.pos[1] - moveVal]);
	};
	
	Player.prototype.moveLeft = function() {
	  let moveVal = 1;
	  if (this.inTheRoad()) {
	    moveVal = 4;
	  }
	
	  this.moveIfValid([this.pos[0] - moveVal, this.pos[1]]);
	};
	
	Player.prototype.moveRight = function() {
	  let moveVal = 1;
	  if (this.inTheRoad()) {
	    moveVal = 4;
	  }
	
	  this.moveIfValid([this.pos[0] + moveVal, this.pos[1]]);
	};
	
	Player.prototype.reachedDestination = function() {
	  if (this.inBounds && this.pos[0] >= FIELDWIDTH - 30 && this.pos[1] <= 30) {
	    return true;
	  }
	
	  return false;
	};
	
	Player.prototype.shoulderPoints = function() {
	  // Need the AVERAGE of the next two vectors
	  let currentAverageVector = [
	    (this.vectors[0][0] + this.vectors[1][0]) / 2,
	    (this.vectors[0][1] + this.vectors[1][1]) / 2
	  ];
	
	  let perpendicularVector = [
	    -1 * currentAverageVector[1],
	    currentAverageVector[0]
	  ];
	  // find the should end points with this formula:
	  // original point +/- [
	  // distance from midpoint to shoulder * normalized vector[0],
	  // distance from midpoint to shoulder * normalized vector[0]
	  let totalShoulderWidth = this.width + 6;
	  let midpointToShoulder = totalShoulderWidth / 2;
	
	  let magnitude = Math.sqrt(Math.pow(perpendicularVector[0], 2) + Math.pow(perpendicularVector[1], 2));
	  let normalizedVector = [
	    perpendicularVector[0] / magnitude,
	    perpendicularVector[1] / magnitude
	  ];
	
	  let shoulderPointOne = [
	    this.center[0] + (midpointToShoulder * normalizedVector[0]),
	    this.center[1] + (midpointToShoulder * normalizedVector[1])
	  ];
	
	  let shoulderPointTwo = [
	    this.center[0] - (midpointToShoulder * normalizedVector[0]),
	    this.center[1] - (midpointToShoulder * normalizedVector[1])
	  ];
	
	  return [shoulderPointOne, shoulderPointTwo];
	};
	
	
	module.exports = Player;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const Obstacle = __webpack_require__(2);
	const DodgeNyGame = __webpack_require__(1);
	
	// NOT DRY!!
	const FIELDWIDTH = 500;
	const FIELDHEIGHT = 500;
	
	function MovingCar(options) {
	  defaults = {
	    topLeft: [
	      (FIELDWIDTH - (FIELDWIDTH / 3)) - (3/8) * (FIELDWIDTH - (FIELDWIDTH / 3)),
	      100
	    ],
	    width: 40,
	    height: 75,
	    color: "#4C6B9E",
	    direction: -1,
	    speed: 30,
	  };
	
	  Object.assign(defaults, options);
	
	  // Use this to DRY up code.
	  // Obstacle.call(this, defaults);
	
	  this.width = defaults.width;
	  this.height = defaults.height;
	  this.color = defaults.color;
	  this.direction = defaults.direction;
	  this.speed = defaults.speed;
	
	  this.leftX   = defaults.topLeft[0];
	  this.rightX  = this.leftX + this.width;
	  this.topY    = defaults.topLeft[1];
	  this.bottomY = this.topY + this.height;
	
	  this.topLeft = defaults.topLeft;
	  this.bottomLeft = [this.leftX, this.bottomY];
	  this.topRight = [this.rightX, this.topY];
	  this.bottomRight = [this.rightX, this.bottomY];
	}
	//
	// function Surrogate() {}
	// Surrogate.prototype = Obstacle.prototype;
	// this.prototype = new Surrogate();
	// this.prototype.constructor = this;
	
	// Shouldn't need this; should inherit
	MovingCar.prototype.isOffCanvas = function () {
	  if (this.leftX <= 0 || this.rightX >= FIELDWIDTH ||
	    this.topY <= 0 || this.bottomY >= FIELDHEIGHT) {
	      return true;
	    }
	
	  return false;
	};
	
	MovingCar.prototype.move = function() {
	  this.topLeft[1] += this.speed * this.direction;
	};
	
	MovingCar.prototype.render = function (canvasContext) {
	  this.draw(canvasContext);
	  this.move();
	};
	
	// Shouldn't need this; should inherit
	MovingCar.prototype.draw = function (canvasContext) {
	  canvasContext.fillStyle = this.color;
	  canvasContext.fillRect(
	    this.topLeft[0],
	    this.topLeft[1],
	    this.width,
	    this.height
	  );
	};
	
	module.exports = MovingCar;


/***/ },
/* 6 */
/***/ function(module, exports) {

	const CARCOLORS = [
	  //taxi
	  "#CEB616",
	  "#CEB616",
	  "#CEB616",
	  "#CEB616",
	  "#CEB616",
	  "#CEB616",
	  "#CEB616",
	  "#CEB616",
	
	  //blue
	  "#4C6B9E",
	  "#4C6B9E",
	  "#4C6B9E",
	
	  //black
	  "#000000",
	  "#000000",
	  "#000000",
	
	  //white
	  "#E0E0E0",
	
	  //red
	  "#A84032",
	
	  //green
	  "#688268",
	  "#688268",
	];
	
	module.exports = CARCOLORS;


/***/ },
/* 7 */
/***/ function(module, exports) {

	const HAIRCOLORS = [
	  // black
	  "#0D0C0C",
	  "#0D0C0C",
	  "#0D0C0C",
	  "#0D0C0C",
	  "#0D0C0C",
	  "#0D0C0C",
	  "#0D0C0C",
	  "#0D0C0C",
	  "#0D0C0C",
	
	  // brown
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
	
	  // light brown
	  "#87692F",
	  "#87692F",
	  "#87692F",
	  "#87692F",
	  "#87692F",
	
	  //blonde
	  "#B7B75B",
	
	  // red
	  "#A26657",
	
	  // old
	  "#F7F7F7"
	];
	
	module.exports = HAIRCOLORS;


/***/ },
/* 8 */
/***/ function(module, exports) {

	const SHIRTCOLORS = [
	  // black
	  "#0B0C18",
	  "#0B0C18",
	  "#0B0C18",
	  "#0B0C18",
	  "#0B0C18",
	  "#0B0C18",
	
	  // gray
	  "#838D95",
	  "#838D95",
	  "#838D95",
	  "#838D95",
	  "#838D95",
	
	  // blue
	  "#41507B",
	  "#41507B",
	  "#41507B",
	
	  //green
	  "#618366",
	];
	
	module.exports = SHIRTCOLORS;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map