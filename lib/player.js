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
