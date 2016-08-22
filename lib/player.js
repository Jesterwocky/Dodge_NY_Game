// NOT DRY!!
const FIELDWIDTH = 500;
const FIELDHEIGHT = 500;

function Player(canvas, startPos, obstacles, otherPeople) {
  this.canvas = canvas;
  this.canvasContext = canvas.getContext("2d");
  this.pos = startPos;
  this.obstacles = obstacles;
  this.otherPeople = otherPeople;
  this.width = 10;
  this.height = 5;
  this.color = "#3F84D3";
}

Player.prototype.draw = function () {
  if (this.intersectsPeople()) {
    this.getShoved();
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
  this.canvasContext.fillStyle = this.color;
  this.canvasContext.fill();
};

Player.prototype.intersectsPeople = function() {
  for (let person of this.otherPeople) {
    if (this.distance(this.pos, person.center) <= (this.width / 2) + (person.width / 2)) {
      return true;
    }
  }
};

Player.prototype.getShoved = function() {
  console.log(`Original pos: ${this.pos}`);
  let xDistance = Math.floor(Math.random() * 10);
  let xDirection = Math.random() <= 0.5 ? -1 : 1;

  let yDistance = Math.floor(Math.random() * 5);
  let yDirection = Math.random() <= 0.5 ? -1 : 1;

  let newX = this.pos[0] + (xDistance * xDirection);
  let newY = this.pos[1] + (yDistance * yDirection);

  if (!this.intersectsAnyObstacle([newX, newY])) {
    this.pos = [newX, newY];
  }
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

Player.prototype.moveIfValid = function(newPos) {
  if (this.inBounds(newPos) && !this.intersectsAnyObstacle(newPos)) {
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
};

// NOT DRY!
Player.prototype.intersectsObstacle = function(pos, obstacle) {
  let xIntersection = (pos[0] >= obstacle.leftX && pos[0] <= obstacle.rightX);
  let yIntersection = (pos[1] >= obstacle.topY && pos[1] <= obstacle.bottomY);

  if (xIntersection && yIntersection) return true;
};

Player.prototype.moveUp = function() {
  this.moveIfValid([this.pos[0], this.pos[1] + 1]);
};

Player.prototype.moveDown = function() {
  this.moveIfValid([this.pos[0], this.pos[1] - 1]);
};

Player.prototype.moveLeft = function() {
  this.moveIfValid([this.pos[0] - 1, this.pos[1]]);
};

Player.prototype.moveRight = function() {
  this.moveIfValid([this.pos[0] + 1, this.pos[1]]);
};

module.exports = Player;
