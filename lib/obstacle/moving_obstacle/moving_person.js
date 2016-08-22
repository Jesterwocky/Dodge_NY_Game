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
    xVal >= (FIELDWIDTH / 3) &&
    xVal <= (FIELDWIDTH - (FIELDWIDTH / 3))
  );
};

MovingPerson.prototype.move = function() {
  // console.log(`Actual first center: ${this.center}`);
  let originalCenter = this.center.slice();
  if (originalCenter[0] != originalCenter[0]) {
    debugger
  }
  console.log(`Logged original Center: ${originalCenter}`);

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

  console.log(`Center before intersect check: ${this.center}`);

  if (this.intersectsAnyObstacle(this.center)) {
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
  console.log(`New center: ${this.center}`);
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
  // let obstacle = this.collidesWith.shift();

  // object with keys "horizontal" and "vertical"
  let collidedSides = this.collidedSides(pos1, pos2);

  let horizontalBarrier = collidedSides.horizontal;
  let verticalBarrier = collidedSides.vertical;

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
      newCenter = [pos1[0], pos2[1]];
    }
  }

  if (this.center === undefined || newCenter === undefined) {
    debugger
  }

  if (newCenter[0] != newCenter[0]) {
    debugger
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
        else if (collidedSides.vertical.length < 1 ||
          this.distance(pos1, [side[0][0], pos1[1]]) <
            this.distance(pos1, [collidedSides.vertical[0][0], pos1[0]])) {
              collidedSides.vertical = side;
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

  console.log(`NEW VECTORS: ${vectors}`);
  this.vectors = vectors;

  // new vectors!
  // let vectors = [[1, -1], [-1, -1]];
  // let newVectors = [];
  //
  // for (let vector of vectors) {
  //   newVectors.push([
  //     (vector[0] * this.speed) + (this.drift * this.driftDirection),
  //     vector[1] * this.speed * this.direction
  //   ]);
  // }
  //
  // this.vectors = newVectors;
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

  // new vectors!
  // let vectors = [[1, -1], [-1, -1]];
  // let newVectors = [];
  //
  // for (let vector of vectors) {
  //   newVectors.push([
  //     (vector[0] * this.speed) + (this.drift * this.driftDirection),
  //     vector[1] * this.speed * this.direction
  //   ]);
  // }
  //
  // this.vectors = newVectors;
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
    debugger
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
