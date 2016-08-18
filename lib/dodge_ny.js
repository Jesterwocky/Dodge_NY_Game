const DodgeNyGame = require('./dodge_ny_game.js');

const HEIGHT = 500;
const WIDTH = 500;

document.addEventListener("DOMContentLoaded", function() {
  // Background
  const backgroundCanvas  = document.getElementById("background-canvas");
  backgroundCanvas.height = HEIGHT;
  backgroundCanvas.width  = WIDTH;
  let backgroundContext   = backgroundCanvas.getContext("2d");

  backgroundContext.fillStyle = "#E1DCCF";
  backgroundContext.fillRect(0, 0, WIDTH, HEIGHT);
  backgroundContext.fillStyle = "#C6C6C6";
  backgroundContext.fillRect((WIDTH / 3), 0, (WIDTH / 3), HEIGHT);

  // Foreground
  const foregroundCanvas  = document.getElementById("foreground-canvas");
  foregroundCanvas.height = HEIGHT;
  foregroundCanvas.width  = WIDTH;
  let foregroundContext   = foregroundCanvas.getContext("2d");

  let game = new DodgeNyGame(foregroundContext, WIDTH, HEIGHT);

  game.play();
});
