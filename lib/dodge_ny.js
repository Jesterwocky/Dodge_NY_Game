const DodgeNyGame = require('./dodge_ny_game.js');

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
  backgroundContext.fillStyle = "#6D6B5E";
  backgroundContext.fillRect(35, 405, 30, 70);
  //destination
  backgroundContext.fillStyle = "#1DB31D";
  backgroundContext.fillRect((WIDTH - 30), 0, 30, 30);

  // Foreground
  const foregroundCanvas  = document.getElementById("foreground-canvas");
  foregroundCanvas.height = HEIGHT;
  foregroundCanvas.width  = WIDTH;

  let game = new DodgeNyGame(foregroundCanvas, WIDTH, HEIGHT);

  const scoreBoard = $("#game-info")[0];
  scoreBoard.innerHTML = "Welcome to New York! Press any key to play";

  $(document).one("keypress", function () {
    game.play();
  });
});
