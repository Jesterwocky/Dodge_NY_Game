const Obstacle = require('../obstacle.js');
const DodgeNyGame = require('../../dodge_ny_game.js');

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
  this.temporaryVectors = [];
  this.consecutiveChangeDrifts = 0;

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

MovingPerson.prototype.isOffCanvas = function (xVal) {
  return (xVal <= 0 || xVal >= FIELDWIDTH);
};

MovingPerson.prototype.inTheRoad = function(xVal) {
  return (
    xVal >= (FIELDWIDTH / 3) + 15 &&
    xVal <= (FIELDWIDTH - (FIELDWIDTH / 3)) - 15
  );
};

MovingPerson.prototype.getOutOfRoadVectors = function() {
  if (this.distance(this.center, [FIELDWIDTH - (FIELDWIDTH / 3), this.center[1]]) <
      this.distance(this.center, [(FIELDWIDTH / 3), this.center[1]])
  ) {
    return this.moveOffRoadEastVectors;
  }

  else {
    return this.moveOffRoadWestVectors;
  }
};

MovingPerson.prototype.avoidRoadAndSides = function() {
  let vectors = this.temporaryVectors.length > 0 ? this.temporaryVectors : this.vectors;
  wronglyInRoad = !this.canCrossStreet && this.inTheRoad(this.center[0] + vectors[0][0]);
  let outtaBounds = this.isOffCanvas(this.center[0] + vectors[0][0]);

  if (outtaBounds || wronglyInRoad) {
    this.driftOppositeDirection();
  }
};

// Gets the next point to which the person expects to move, before checking for obstacles
MovingPerson.prototype.getVectorSource = function() {
  let vectorSource = this.temporaryVectors.length > 0 ? this.temporaryVectors : this.vectors;

  let wronglyInRoad = !this.canCrossStreet && this.inTheRoad(this.center[0] + vectorSource[0][0]);
  if (wronglyInRoad) {
    vectorSource = this.getOutOfRoadVectors();
  }

  return vectorSource;
};

MovingPerson.prototype.getVectorsToAvoidObstacle = function(collidedObstacles, vector, nextVector) {
  let barriers = this.collidedSides(
    this.center,
    [this.center[0] + vector[0], this.center[1] + vector[1]],
    collidedObstacles
  );

  let horizontalBarrier = barriers.horizontal;
  let verticalBarrier = barriers.vertical;
  // need: slope of vector; horizontal vs vertical barrier.
  // If horizontal, go in the direction of the vector's slope horizontally past the barrier.
  // If vertical, just drift in the opposite direction

  if (horizontalBarrier !== undefined) {
    let distanceToTravel = 0;
    let vectorsToAdd = [];

    // if going down
    if (this.direction > 0) {
      // if drifting right
      if (this.drift >= 0) {
        distanceToTravel = Math.abs(this.center[0] - horizontalBarrier[1][0]);
        vectorsToAdd = [[1, -1], [1, 1]];
      }
      //if drifting left, or not drifting at all
      else {
        distanceToTravel = Math.abs(this.center[0] - horizontalBarrier[0][0]);
        vectorsToAdd = [[-1, -1], [-1, 1]];
      }
    }

    // if going up
    else {
      // if drifting right
      if (this.drift >= 0) {
        distanceToTravel = Math.abs(this.center[0] - horizontalBarrier[1][0]);
        vectorsToAdd = [[1, -1], [1, 1]];
      }

      // if drifting left. or not drifting at all
      else {
        distanceToTravel = Math.abs(this.center[0] - horizontalBarrier[0][0]);
        vectorsToAdd = [[-1, -1], [-1, 1]];
      }
    }

    let vectors = [];

    let xDistanceTravelled = 0;
    while (xDistanceTravelled <= distanceToTravel) {

      vectors = vectors.concat(vectorsToAdd);
      xDistanceTravelled += Math.abs(vectorsToAdd[0][0] + vectorsToAdd[1][0]);
    }

    this.temporaryVectors = vectors;
  }

  if (verticalBarrier !== undefined) {
    if (this.consecutiveChangeDrifts < 1) {
      this.driftOppositeDirection();
      this.consecutiveChangeDrifts += 1;
    }

    else {
      this.consecutiveChangeDrifts = 0;
      this.randomlyChangeDirection();
    }
  }

  else {
    this.consecutiveChangeDrifts = 0;
  }
};

MovingPerson.prototype.move = function() {
  let originalPos = this.center.slice();
  if (this.center[1] > FIELDHEIGHT) {
    this.center[1] = this.center[1] % FIELDHEIGHT;
  }

  let vectorSource = this.getVectorSource();
  let wronglyInRoad = !this.canCrossStreet && this.inTheRoad(this.center[0] + vectorSource[0][0]);
  let sourceIsTempVectors = this.temporaryVectors.length > 0  && !wronglyInRoad ? true : false;

  let movement = vectorSource.shift();

  let newY = this.center[1] + movement[1] % FIELDHEIGHT;
  if (newY <= 0) {
    newY = FIELDHEIGHT - 5;
  }

  let prospectiveNewPoint = [
    this.center[0] + movement[0],
    newY
  ];

  if (!sourceIsTempVectors) {
    vectorSource.push(movement);
  }

  // logic: if there's a collision, don't make the move this turn. Clear out
  // temporaryVectors (in case the colliding vector comes from there) and push
  // into temporaryVectors a set of moves that are calculated to take the
  // person parallel to the side until the person is past the side.
  let collidedObstacles = this.collidesWith(prospectiveNewPoint);
  if (collidedObstacles.length > 0) {
    let nextVector = this.temporaryVectors.length > 1 ? this.temporaryVectors[0] : this.vectors[0];
    this.center = [originalPos[0] + (movement[0] * -1), originalPos[1] + (movement[1] * -1)];
    this.getVectorsToAvoidObstacle(collidedObstacles, movement, nextVector);
  }

  else {
    this.center = prospectiveNewPoint;
    this.avoidRoadAndSides();
  }
};

// This is the new do-all function
MovingPerson.prototype.collidesWith = function(pos) {
  let collisions = [];

  for (let obstacle of this.obstacles) {
    if (this.intersectsObstacle(pos, obstacle)) {
      collisions.push(obstacle);
    }
  }

  return collisions;
};

MovingPerson.prototype.intersectsObstacle = function(pos, obstacle) {
  // 5 pixel buffer around obstacles
  let xIntersection = (pos[0] >= obstacle.leftX - 5 && pos[0] <= obstacle.rightX + 5);
  let yIntersection = (pos[1] >= obstacle.topY - 5 && pos[1] <= obstacle.bottomY + 5);

  if (xIntersection && yIntersection) return true;
};

MovingPerson.prototype.collidedSides = function(pos1, pos2, collidedObstacles) {
  let collidedSides = { horizontal: undefined, vertical: undefined };

  for (let obstacle of collidedObstacles) {
    let horizontalSides = [
      [obstacle.topLeft, obstacle.topRight],
      [obstacle.bottomLeft, obstacle.bottomRight]
    ];

    let verticalSides = [
      [obstacle.topLeft, obstacle.bottomLeft],
      [obstacle.topRight, obstacle.bottomRight]
    ];

    for (let side of horizontalSides) {
      if (this.linesCollide([pos1, pos2], side)) {
        if (collidedSides.horizontal === undefined ||
          this.distance(pos1, [pos1[0], side[0][1]]) <
            this.distance(pos1, [pos1[0], collidedSides.horizontal[0][1]])) {
              collidedSides.horizontal = side;
            }
      }
    }

    for (let side of verticalSides) {
      if (collidedSides.vertical === undefined ||
        this.distance(pos1, [side[0][0], pos1[1]]) <
          this.distance(pos1, [collidedSides.vertical[0][0], pos1[0]])) {
            collidedSides.vertical = side;
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

MovingPerson.prototype.linesCollide = function(endPoints1, endPoints2) {
  //buffer = 5 px
  let pos1 = endPoints1[0];
  let pos2 = endPoints1[1];

  // If X vals are the same for both points, i.e., side is vertical
  if (endPoints2[0][0] === endPoints2[1][0]) {
    if (
      pos1[0] <= endPoints2[0][0] && pos2[0] + 5 >= endPoints2[0][0] ||
      pos2[0] - 5 <= endPoints2[0][0] && pos1[0] >= endPoints2[0][0]
    ) {
      if (pos2[1] >= endPoints2[0][1] && pos2[1] <= endPoints2[1][1]) {
        return true;
      }
    }
  }
  // if side is horizontal
  else {
    if (
      pos1[1] <= endPoints2[0][1] && pos2[1] + 5 >= endPoints2[0][1] ||
      pos2[1] - 5 <= endPoints2[0][1] && pos1[1] >= endPoints2[0][1]
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

  return ([xIntersect, yIntersect]);
};

MovingPerson.prototype.driftOppositeDirection = function() {
  this.driftDirection *= -1;

  let vectors = [];
  for (let vector of this.vectors) {
    vectors.push([
      vector[0] * this.driftDirection,
      vector[1]
    ]);
  }
  this.vectors = vectors;

  if (this.temporaryVectors.length > 0) {
    let tempVectors = [];
    for (let vector of this.temporaryVectors) {
      tempVectors.push([
        vector[0] * this.driftDirection,
        vector[1]
      ]);
    }

    this.temporaryVectors = tempVectors;
  }

};

MovingPerson.prototype.render = function (canvasContext) {
  this.draw(canvasContext);
  this.move();
};

MovingPerson.prototype.shoulderPoints = function() {
  // Need the AVERAGE of the next two vectors.
  let vectors = this.temporaryVectors.length > 0 ? this.temporaryVectors.concat(this.vectors) : this.vectors;

  let currentAverageVector = [
    (vectors[0][0] + vectors[1][0]) / 2,
    (vectors[0][1] + vectors[1][1]) / 2
  ];

  // to get shoulder swing, then take the average of the NEXT vector and the average found above

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
    (this.width / 2) - 0.1,
    0,
    2 * Math.PI,
    false
  );
  canvasContext.fillStyle = this.hairColor;
  canvasContext.fill();
};

module.exports = MovingPerson;
