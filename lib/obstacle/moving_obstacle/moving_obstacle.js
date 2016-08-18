const DEFAULTS = {
  position: [0, 0],
  height: 3,
  width: 1,
  // decide what this means... Moves per render?
  speed: 3,
  vectors: [[-1, -1], [1, -1]]
};

function MovingObstacle(options) {
  
}

MovingObstacle.prototype.move = function() {
  movement = vectors.pop;

};

MovingObstacle.prototype.getPushed = function(collisionPoint) {

};
