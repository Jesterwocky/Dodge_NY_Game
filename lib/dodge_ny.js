const DodgeNyGame = require('./dodge_ny_game.js');

const HEIGHT = 500;
const WIDTH = 500;

const STARTPOS = [50, 460];

// const SIDEWALKCOLOR = "#E4E2DC";
// const SIDEWALKCOLOR = "#e4e4e2";
const SIDEWALKCOLOR = "#efefec";
// const ROADCOLOR = "#C6C6C6";
const ROADCOLOR = "#a5a1a1";
const SUBWAYSTARTCOLOR = "#C2BEB7";
const DESTINATIONCOLOR = "#1DB31D";

function drawSidewalk(context) {
  context.fillStyle = SIDEWALKCOLOR;
  context.fillRect(0, 0, WIDTH, HEIGHT);
}

function drawRoad(context) {
  context.fillStyle = ROADCOLOR;
  context.fillRect((WIDTH / 3), 0, (WIDTH / 3), HEIGHT);
}

function drawSubwayStart(context) {
  context.fillStyle = SUBWAYSTARTCOLOR;
  context.fillRect(35, 405, 30, 70);
}

function drawDestination(context) {
  context.fillStyle = DESTINATIONCOLOR;
  context.fillRect((WIDTH - 30), 0, 30, 30);
}

function backgroundCanvasSetup() {
  const backgroundCanvas  = document.getElementById("background-canvas");
  backgroundCanvas.height = HEIGHT;
  backgroundCanvas.width  = WIDTH;
  const backgroundContext   = backgroundCanvas.getContext("2d");

  drawSidewalk    (backgroundContext);
  drawRoad        (backgroundContext);
  drawSubwayStart (backgroundContext);
  drawDestination (backgroundContext);
}

function foregroundCanvasSetup() {
  const foregroundCanvas  = document.getElementById("foreground-canvas");
  foregroundCanvas.height = HEIGHT;
  foregroundCanvas.width  = WIDTH;

  return foregroundCanvas;
}

function displayGameInfo() {
  const instructionsSection = $("#instructions-overlay")[0];
  instructionsSection.innerHTML =
    "Get from the subway to work (green square) without losing your cool. <br/> <br/> Press any key to start. You're the one in red. <br/> <br/> Good luck!";

  const scoreBoard = $("#game-info")[0];
  scoreBoard.innerHTML = "Welcome to New York! Press any key to play";
}

document.addEventListener("DOMContentLoaded", function() {
  backgroundCanvasSetup();
  displayGameInfo();

  $(document).one("keydown", function () {
    const game = new DodgeNyGame(foregroundCanvasSetup(), WIDTH, HEIGHT);
    game.play();
  });
});
