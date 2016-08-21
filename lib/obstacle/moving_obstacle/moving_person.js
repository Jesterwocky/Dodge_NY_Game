const Obstacle = require('../obstacle.js');
const DodgeNyGame = require('../../dodge_ny_game.js');

// NOT DRY!!
const FIELDWIDTH = 500;
const FIELDHEIGHT = 500;

function MovingPerson(options) {
  defaults = {
    center: [0, 100],
    width: 10,
    height: 10,
    color: "#5F3E3E",
    direction: -1,
    speed: 1,
    drift: 2,
    driftDirection: -1,
    fearsRoad: true,
    canCrossStreet: false,
    obstacles: [],

    vectors: [[1, -1], [-1, -1]]
  };

  Object.assign(defaults, options);

  // Use this to DRY up code.
  // Obstacle.call(this, defaults);

  this.center = defaults.center;
  this.width = defaults.width;
  this.height = defaults.height;
  this.color = defaults.color;
  this.direction = defaults.direction;
  this.speed = defaults.speed;
  this.drift = defaults.drift;
  this.driftDirection = defaults.driftDirection;
  this.fearsRoad = defaults.fearsRoad;
  this.canCrossStreet = defaults.canCrossStreet;
  this.obstacles = defaults.obstacles;

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
  return xVal < 0 || xVal > FIELDWIDTH;
};

// Not DRY!!
MovingPerson.prototype.inTheRoad = function(xVal) {
  return (
    xVal > (FIELDWIDTH / 3) &&
    xVal < (FIELDWIDTH - (FIELDWIDTH / 3))
  );
};

MovingPerson.prototype.move = function() {
  console.log(`Actual first center: ${this.center}`);
  let originalCenter = this.center.slice();
  console.log(`Logged original Center: ${originalCenter}`);

  let wronglyInRoad = !this.canCrossStreet && this.inTheRoad(this.center[0] + this.vectors[0][0]);
  let avoidingRoad = this.fearsRoad && this.inTheRoad(this.center[0] + 30, this.center[1]) ||
    this.fearsRoad && this.inTheRoad(this.center[0] - 30, this.center[1]);
  let outtaBounds = this.isOffCanvas(this.center[0] + this.vectors[0][0]);
  let closeToSide = this.center[0] <= 30 && this.driftDirection < 1 ||
    this.center[0] >= FIELDHEIGHT - 30 && this.driftDirection > 1;

  if (wronglyInRoad || avoidingRoad || outtaBounds || closeToSide) {
    this.changeDrift();
  }

  let movement = this.vectors.shift();

  this.center[0] = (this.center[0] + movement[0]);
  let newY = this.center[1] + movement[1];
  this.center[1] = (newY > 0) ? Math.floor(newY % FIELDHEIGHT) : FIELDHEIGHT;

  if (movement.length === 2) {
    this.vectors.push(movement);
  }

  console.log(`Center before intersect check: ${this.center}`);

  if (this.intersectsAnyObstacle(this.center)) {
    let startingPoint = this.center.slice();
    this.handleIntersection(originalCenter, startingPoint);
  }

  console.log(`New center: ${this.center}`);

};

MovingPerson.prototype.handleIntersection = function(pos1, pos2) {
  // Should be more selective
  let obstacle = this.collidesWith[0];

  let obstacleSegments = [
    // horizontal
    [[obstacle.leftX, obstacle.topY], [obstacle.rightX, obstacle.topY]],
    [[obstacle.leftX, obstacle.bottomY], [obstacle.rightX, obstacle.bottomY]],

    // vertical
    [[obstacle.leftX, obstacle.topY], [obstacle.leftX, obstacle.bottomY]],
    [[obstacle.rightX, obstacle.topY], [obstacle.rightX, obstacle.bottomY]],
  ];

  let collidedSides = [];

  for (let endPoints of obstacleSegments) {
    if (this.collide(pos1, pos2, endPoints)) {
      collidedSides.push(endPoints);
    }
  }

  let collidedSide = collidedSides[0];
  let collisionPoint = this.collisionPoint([pos1, pos2], collidedSides[0]);

  if (collidedSides.length > 1) {
    let secondCollisionPoint = this.collisionPoint([pos1, pos2], collidedSides[1]);

    if (
      Math.sqrt(
        Math.pow(secondCollisionPoint[0] - pos1[0], 2) +
        Math.pow(secondCollisionPoint[1] - pos1[1], 2)
      ) <
      Math.sqrt(
        Math.pow(collisionPoint[0] - pos1[0], 2) +
        Math.pow(collisionPoint[1] - pos1[1], 2)
      )
    ) {
      collidedSide = collidedSides[1];
      collisionPoint = secondCollisionPoint;
    }
  }

  let intersectedSideType;

  // If line is vertical
  if (collidedSide[0][0] === collidedSide[1][0]) {
    intersectedSideType = "vertical";
    this.center = [
      pos1[0],
      // pos2[1]
      Math.floor(pos1[1] + Math.sqrt(
                  Math.pow(pos2[0] - pos1[0], 2) +
                  Math.pow(pos2[1] - pos1[1], 2)
                ))
    ];
  }
  // If line is horizontal
  else {
    intersectedSideType = "horizontal";
    this.center = [
      Math.floor(pos1[0] + Math.sqrt(
                  Math.pow(pos2[0] - pos1[0], 2) +
                  Math.pow(pos2[1] - pos1[1], 2)
                )),
      // pos2[0],
      pos1[1]
    ];
  }

  // let wronglyInRoad = !this.canCrossStreet && this.inTheRoad(this.center[0] + this.vectors[0][0]);
  // let avoidingRoad = this.fearsRoad && this.inTheRoad(this.center[0] + 30, this.center[1]) ||
  //   this.fearsRoad && this.inTheRoad(this.center[0] - 30, this.center[1]);
  // let outtaBounds = this.isOffCanvas(this.center[0] + this.vectors[0][0]);
  // let closeToSide = this.center[0] <= 30 && this.driftDirection < 1 ||
  //   this.center[0] >= FIELDHEIGHT - 30 && this.driftDirection > 1;
  //
  // if (wronglyInRoad || avoidingRoad || outtaBounds || closeToSide) {
  //   this.changeDrift();
  // }

  if (this.intersectsAnyObstacle(this.center)) {
    let originalPos = this.center.slice();
    this.center = pos1;
    if (intersectedSideType === "vertical") {
      // this.movement.unshift([pos1[0]])

    }
  }

};

MovingPerson.prototype.collide = function(pos1, pos2, endPoints) {
  // If X vals are the same for both points, i.e., side is vertical
  if (endPoints[0][0] === endPoints[1][0]) {
    if (
      pos1[0] <= endPoints[0][0] && pos2[0] >= endPoints[0][0] ||
      pos2[0] <= endPoints[0][0] && pos1[0] >= endPoints[0][0]
    ) {
      if (pos2[1] >= endPoints[0][1] && pos2[1] <= endPoints[1][1]) {
        return true;
      }
    }
  }
  // if side is horizontal
  else {
    if (
      pos1[1] <= endPoints[0][1] && pos2[1] >= endPoints[0][1] ||
      pos2[1] <= endPoints[0][1] && pos1[1] >= endPoints[0][1]
    ) {
      if (pos2[0] >= endPoints[0][0] && pos2[0] <= endPoints[1][0]) {
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

  return ([xIntersect, yIntersect]);
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

MovingPerson.prototype.changeDrift = function() {
  this.driftDirection *= -1;

  let vectors = [];

  for (let vector of this.vectors) {
    vectors.push([
      vector[0] * this.driftDirection,
      vector[1]
    ]);
  }

  this.vectors = vectors;
};

MovingPerson.prototype.render = function (canvasContext) {
  this.draw(canvasContext);
  this.move();
};

// Shouldn't need this; should inherit
MovingPerson.prototype.draw = function (canvasContext) {
  canvasContext.beginPath();
  canvasContext.arc(
    this.center[0],
    this.center[1],
    this.width / 2,
    0,
    2 * Math.PI,
    false
  );
  canvasContext.fillStyle = this.color;
  canvasContext.fill();
};

module.exports = MovingPerson;
