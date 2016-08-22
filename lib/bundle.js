/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DodgeNyGame = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./Dodge_NY_Game/dodge_ny_game.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
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
	  backgroundContext.fillStyle = "#C2BEB7";
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map