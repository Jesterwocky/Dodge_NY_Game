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
  this.patience = 100;
  this.lostYourCool = false;
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

  if (!this.lostYourCool) {
    let score = parseInt(this.scoreCard.innerHTML);

    if (score < 0) {
      this.lostYourCool = true;
      this.scoreCard.innerHTML = "YOU LOST YOUR COOL";
      $(this.scoreCard).removeClass("getting-impolite");
      $(this.scoreCard).addClass("most-impolite");
    }

    else {
      this.scoreCard.innerHTML = this.patience;

      if (score < 25 && !$(this.scoreCard).hasClass("getting-impolite")) {
        $(this.scoreCard).addClass("getting-impolite");
      }
    }
  }
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

  this.patience -= 1;
};

Player.prototype.distance = function(pos1, pos2) {
  return Math.floor(Math.sqrt(Math.pow(pos2[0] - pos1[0], 2) + Math.pow(pos2[1] - pos1[1], 2)));
};

Player.prototype.inBounds = function(pos) {
  if (pos[0] <= FIELDWIDTH && pos[0] >= 0 && pos[1] <= FIELDHEIGHT && pos[1] >= 0) {
    return true;
  }

  return false;
};


Player.prototype.inTheRoad = function() {
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
    this.pos = newPos;
  }
};

Player.prototype.intersectsAnyObstacle = function(pos) {
  for (let obstacle of this.obstacles) {
    if (this.intersectsObstacle(pos, obstacle)) {
      return true;
    }
  }

  return false;
};

Player.prototype.intersectsObstacle = function(pos, obstacle) {
  let xIntersection = (pos[0] >= obstacle.leftX && pos[0] <= obstacle.rightX);
  let yIntersection = (pos[1] >= obstacle.topY && pos[1] <= obstacle.bottomY);

  if (xIntersection && yIntersection) return true;
};

Player.prototype.move = function(direction) {
  let moveVal = 1;
  if (this.inTheRoad() || this.lostYourCool) {
    moveVal = 4;
  }

  switch(direction) {
    case "up":
      this.moveIfValid([this.pos[0], this.pos[1] + moveVal]);
      break;
    case  "down":
      this.moveIfValid([this.pos[0], this.pos[1] - moveVal]);
      break;
    case "left":
      this.moveIfValid([this.pos[0] - moveVal, this.pos[1]]);
      break;
    case "right":
      this.moveIfValid([this.pos[0] + moveVal, this.pos[1]]);
      break;
  }
};

Player.prototype.moveUp = function() {
  this.move("up");
};

Player.prototype.moveDown = function() {
  this.move("down");
};

Player.prototype.moveLeft = function() {
  this.move("left");
};

Player.prototype.moveRight = function() {
  this.move("right");
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
