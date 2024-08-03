const FPS = 60;
const FRICTION = 0.8; // Friction Coefficiant, typically between 0-1. 1 is lots

// Game Settings
const GAME_LIVES = 3; // Starting Lives
const ROID_LG_PTS = 20; // Points for Large Asteroid
const ROID_M_PTS = 50; // Points for Medium Asteroid
const ROID_SM_PTS = 100; // Points for Small Asteroid
const SAVE_KEY_SCORE = "highscore"; //Save Key for local highscore
let SOUND_ON = true;
let MUSIC_ON = true;

// Roid Settings
const ROIDS_NUM = 6; // Starting Asteroids
const ROIDS_SPD = 55; // Max Starting Speed px per s
const ROIDS_SIZE = 100; // Size in px
const ROIDS_VERT = 10; //Avg Verticies on each Asteroid
const ROIDS_JAG = 0.4; // Asteroid Jaggedness from 0-1

// Ship Settings
const SHIP_SIZE = 30; // in px
const TURN_SPEED = 360; // Turn Speed in Deg / S
const SHIP_THRUST = 5; // Acceleration in px / S
const SHIP_EXPLODE_DUR = 0.2; // Duration of Explosion
const SHIP_BLINK_DUR = 0.1; // Duration in s of blinking when invis
const SHIP_INV_DUR = 3; // Duration of ship invuln

// Weapon Settings
const LASER_MAX = 15; // Max Lasers on Screen at Once
const LASER_SPD = 150; // In px per s
const LASER_DIST = 0.6; // Laser Max Distance as fr of screen width
const LASER_EXPLODE_DUR = 0.1; // Laser Explosion time

// TEXT SETTINGS
const TEXT_FADE_TIME = 2.5; // text fade time in sec
const TEXT_SIZE = 55; // text height in px

// Show (for Development)
const SHOW_BOUNDING = false;
const SHOW_CENTER = true;

// Neural Network
const AUTOMATION_ON = true;
// const AUTOMATION_ON = false;
let TURRET_MODE = false;
const NUM_INPUTS = 9;
const NUM_HIDDEN = 14;
const NUM_OUTPUTS = 1;
const NUM_SAMPLES = 100000;
const OUTPUT_LEFT = 0; // expected neural output for left
const OUTPUT_RIGHT = 1; // expected neural output for right
const OUTPUT_THRESHOLD = 0.05 // how close the prediction must be to commit to a turn
const RATE_OF_FIRE = 5; // Shots Per Sec

let playAgain
let aiON
let aiOFF

const WIDTH = 900
const HEIGHT = 695
let initialized = 0


let canv
let ctx
let gameUpdates

function getCanvas(back) {
  
  if (initialized == 1 || back) {
    document.querySelector(".playGame").classList.remove('hidden')
    if (initialized == 1) {
      gameOver()
      clearInterval(gameUpdates)
      document.removeEventListener("keydown", keyDown);
      document.removeEventListener("keyup", keyUp)
    }
    initialized = 0
  } else {
    initialized = 1
    document.addEventListener("keydown", keyDown);
    document.addEventListener("keyup", keyUp);
    canv = document.getElementById("gameCanvas");
    ctx = canv.getContext("2d");
  
    document.querySelector(".playGame").classList.add('hidden')
    playAgain = document.querySelector(".playAgain");
    aiON = document.querySelector(".aiON");
    aiOFF = document.querySelector(".aiOFF");
    aiOFF.classList.remove('hidden')
    newGame();
    initializeAI()
    gameUpdates = setInterval(update, 1000 / FPS);
  }


  // setTimeout(() => {
  //   newGame();
  //   setInterval(update, 1000 / FPS);
  // }, 1000)
  
}

// while (document.getElementById("gameCanvas") == null) {
//   canv = document.getElementById("gameCanvas");
//   var ctx = canv.getContext("2d");
//   console.log('a')
// }
// Canvas Setup


// Sound Setup
// import hit from './Sounds/hit/m4a'
// import explode from './Sounds/explode.m4a'
// import laser from './Sounds/pew.mp3'
// import thrust from './Sounds/thrust.m4a'
// import musicLow from './Sounds/low2.mp'
// import musicHigh from '/Sounds/high2.mp'


var fxHit = new Sound("./games/Sounds/hit.m4a", 5, 0.4);
var fxExplode = new Sound("./games/Sounds/explode.m4a", 1, 0.5);
var fxLaser = new Sound("./games/Sounds/pew.mp3", 5, 0.2); // (src, max string, vol)
var fxThrust = new Sound("./games/Sounds/thrust.m4a", 1, 0.2);
// var fxHit = new Sound(hit, 5, 0.4);
// var fxExplode = new Sound(explode, 1, 0.5);
// var fxLaser = new Sound(laser, 5, 0.2); // (src, max string, vol)
// var fxThrust = new Sound(thrust, 1, 0.2);


// Background Music
var music = new Music("./games/Sounds/low2.mp3", "./games/Sounds/high2.mp3");
// var music = new Music(musicLow, musicHigh);

var roidsLeft, roidsTotal;

// NEW GAME, LEVELS, LIVES
var level, roids, ship, text, textAlpha, lives, score, scoreHigh;
// newGame();
function newGame() {
  score = 0;
  level = 0;
  lives = GAME_LIVES;
  ship = newShip();
  playAgain.classList.add("hidden");

  // Get High Score from Local Storage
  var scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
  if (scoreStr == null) {
    scoreHigh = 0;
  } else {
    scoreHigh = parseInt(scoreStr);
  }

  newLevel();
}
function newLevel() {
  text = "Level " + (level + 1);
  textAlpha = 1.0;
  createAsteroidBelt();
}
function gameOver() {
  ship.destroyed = true;
  text = "Game Over";
  textAlpha = 1.0;
  TURRET_MODE = false;
  aiON.classList.add("hidden");
  aiOFF.classList.remove("hidden");
}

function turretMode() {
  if (!TURRET_MODE) {
  TURRET_MODE = true;
  aiON.classList.toggle("hidden");
  aiOFF.classList.toggle("hidden");
  } else {
    TURRET_MODE = false;
    ship.rot = 0;
    aiON.classList.toggle("hidden");
  aiOFF.classList.toggle("hidden");
  }
} 
function turretOFF() {
  if (TURRET_MODE) {
    TURRET_MODE = false;
    ship.rot = 0;
  }
  }




// Mute Button
function Mute() {
  if (MUSIC_ON || SOUND_ON) {
    document.getElementById('soundON').classList.add('hidden')
    document.getElementById('soundOFF').classList.remove('hidden')
    MUSIC_ON = false;
    SOUND_ON = false;
  } else {
    document.getElementById('soundOFF').classList.add('hidden')
    document.getElementById('soundON').classList.remove('hidden')
    MUSIC_ON = true;
    SOUND_ON = true;
  }
}

// Event Handler Setup
// document.addEventListener("keydown", keyDown);
// document.addEventListener("keyup", keyUp);

// Game Loop Setup
// setInterval(update, 1000 / FPS);

// FUNCTIONS ------------------------------------------

// Event Handlers
function keyDown(/** @type {KeyboardEvent} */ ev) {
  switch (ev.keyCode) {
    case 40: // Down Arrow
    turretMode();
      break;
  }
  if (ship.destroyed || TURRET_MODE) {
    return;
  }
  switch (ev.keyCode) {
    case 32: // Space Bar
      shootLaser();
      break;
    case 37: // Left Arrow
      rotateShip(false);
      // ship.rot = ((TURN_SPEED / 180) * Math.PI) / FPS;
      break;
    case 38: // Up Arrow
      ship.thrusting = true;
      break;
    case 39: // Right Arrow
    rotateShip(true);
      // ship.rot = ((-TURN_SPEED / 180) * Math.PI) / FPS;
      break;
    // case 40: // Down Arrow
    // turretMode();
    //   break;
  }
}
function keyUp(/** @type {KeyboardEvent} */ ev) {
  if (ship.destroyed || TURRET_MODE) {
    return;
  }

  switch (ev.keyCode) {
    case 32: // Space Bar + Allow Shooting Again - 1 shot per press
      ship.canShoot = true;
      break;
    case 37: // Left Arrow
      ship.rot = 0;
      break;
    case 38: // Up Arrow
      ship.thrusting = false;
      break;
    case 39: // Right Arrow
      ship.rot = 0;
      break;
    case 40: // Down Arrow
      break;
  }
}
// Distance Calc via pathagorean
function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
// Angle Calc
function angleToPoint(x, y, bearing, targetX, targetY) {
  let angToTarget = Math.atan2(-targetY + y, targetX - x);
  let diff = bearing - angToTarget;
  return (diff + Math.PI * 2) % (Math.PI * 2);
}

function angleToTarget(x, y, targetX, targetY) {
  return angleTarget = Math.atan2(-targetY + y, targetX - x);
}

//Normalize values between 0 and 1
function normaliseInput(roidX, roidY, roidA, shipA, aimA, lXv, lYv, aXv, aYv) {
  let input = [];
  input[0] = (roidX + ROIDS_SIZE / 2) / (WIDTH + ROIDS_SIZE);
  input[1] = (roidY + ROIDS_SIZE / 2) / (HEIGHT + ROIDS_SIZE);
  input[2] = roidA / (Math.PI * 2);
  input[3] = shipA / (Math.PI * 2);
  input[4] = aimA / (Math.PI * 2);
  input[5] = lXv / WIDTH;
  input[6] = lYv / HEIGHT;
  input[7] = aXv / (WIDTH + ROIDS_SIZE);
  input[8] = aYv / (HEIGHT + ROIDS_SIZE);
  return input;
}

// Rotate Ship
function rotateShip(right) {
  let sign = right ? -1 : 1;
  ship.rot = TURN_SPEED / 180 * Math.PI / FPS * sign;
}

// Sound Settings
function Sound(src, maxStreams = 1, vol = 1.0) {
  this.streamNum = 0;
  this.streams = [];
  for (var i = 0; i < maxStreams; i++) {
    this.streams.push(new Audio(src));
    this.streams[i].volume = vol;
  }
  // Allows more max streams of play, so sounds can overlap i.e. rapid firing gun
  // pew pew pew pew pew pew pew
  this.play = function () {
    if (SOUND_ON) {
      this.streamNum = (this.streamNum + 1) % maxStreams;
      this.streams[this.streamNum].play();
    }
  };
  this.stop = function () {
    this.streams[this.streamNum].pause();
    this.streams[this.streamNum].currentTime = 0;
  };
}
// Music Setting
function Music(srcLow, srcHigh) {
  this.soundLow = new Audio(srcLow);
  this.soundHigh = new Audio(srcHigh);
  this.low = true;
  this.tempo = 1.0; // sec per beat
  this.beatTime = 0; //frames til next beat

  this.play = function () {
    if (MUSIC_ON) {
      if (this.low) {
        this.soundLow.play();
      } else {
        this.soundHigh.play();
      }
      this.low = !this.low;
    }
  };
  this.setAsteroidRatio = function (ratio) {
    this.tempo = 1.0 - 0.75 * (1.0 - ratio); //fastest rate .25 or 4 beats per sec
  };
  this.tick = function () {
    if (this.beatTime == 0) {
      this.play();
      this.beatTime = Math.ceil(this.tempo * FPS);
    } else {
      this.beatTime--;
    }
  };
}
// ASTEROID FUNCTIONS
// Individual Astroids with Random Features
function newAsteroid(x, y, r) {
  var lvlMult = 1 + 0.1 * level;
  var roid = {
    x: x,
    y: y,
    xv:
      ((Math.random() * ROIDS_SPD * lvlMult) / FPS) *
      (Math.random() < 0.5 ? 1 : -1),
    yv:
      ((Math.random() * ROIDS_SPD * lvlMult) / FPS) *
      (Math.random() < 0.5 ? 1 : -1),
    r: r,
    a: Math.random() * Math.PI * 2,
    vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
    offs: [],
    // X, Y, XV and YV in random direction, radius, angle (in radians), verticies, offset
  };
  // populate the offsets array, for shape variance
  for (var i = 0; i < roid.vert; i++) {
    roid.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG);
  }
  return roid;
}
// Actually Spawns the Asteroids
function createAsteroidBelt() {
  roids = [];
  roidsTotal = (ROIDS_NUM + level) * 7;
  roidsLeft = roidsTotal;
  var x, y;
  for (var i = 0; i < ROIDS_NUM + level; i++) {
    //Do while loop so asteroids never spawn on our ship
    do {
      x = Math.floor(Math.random() * WIDTH);
      y = Math.floor(Math.random() * HEIGHT);
    } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);

    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 2)));
  }
}
// Destroys / Splits the Asteroids
function destroyAsteroid(index) {
  var x = roids[index].x;
  var y = roids[index].y;
  var r = roids[index].r;

  if (r == Math.ceil(ROIDS_SIZE / 2)) {
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
    score += ROID_LG_PTS;
  } else if (r == Math.ceil(ROIDS_SIZE / 4)) {
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
    score += ROID_M_PTS;
  } else {
    score += ROID_SM_PTS;
  }

  roids.splice(index, 1);
  fxHit.play();

  //Calc ratio of remaining asteroids for music tempo
  roidsLeft--;
  music.setAsteroidRatio(roidsLeft == 0 ? 1 : roidsLeft / roidsTotal);

  if (roids.length == 0) {
    level++;
    newLevel();
  }

  // Score Checker
  if (score > scoreHigh) {
    scoreHigh = score;
    localStorage.setItem(SAVE_KEY_SCORE, scoreHigh);
  }
}

// SHIP FUNCTIONS
// New Ship Object
function newShip() {
  return {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    r: SHIP_SIZE / 2,
    a: (90 / 180) * Math.PI,
    rot: 0,
    thrusting: false,
    thrust: {
      x: 0,
      y: 0,
    },
    explodeTime: 0,
    blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
    blinkNum: Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR),
    canShoot: true,
    lasers: [],
    destroyed: false,
  };
}
// Draw Ship
function drawShip(x, y, a, color = "aqua") {
  // Drawing Ship (triangular)
  ctx.strokeStyle = color;
  ctx.linewidth = SHIP_SIZE / 20;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "aqua";
  ctx.beginPath();
  ctx.moveTo(
    // Ship Nose
    x + (4 / 3) * ship.r * Math.cos(a), // 4 / 3 is to shift triangle to match true center
    y - (4 / 3) * ship.r * Math.sin(a)
  );
  ctx.lineTo(
    //Rear Left
    x - ship.r * ((2 / 3) * Math.cos(a) + Math.sin(a)), // 2/3 for centering
    y + ship.r * ((2 / 3) * Math.sin(a) - Math.cos(a))
  );
  ctx.lineTo(
    //Rear Right
    x - ship.r * ((2 / 3) * Math.cos(a) - Math.sin(a)),
    y + ship.r * ((2 / 3) * Math.sin(a) + Math.cos(a))
  );
  ctx.closePath();
  ctx.stroke();
}
// Ship go Boom
function explodeShip() {
  ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);
  fxExplode.play();
}
// Ship Guns
function shootLaser() {
  if (ship.canShoot && ship.lasers.length < LASER_MAX) {
    ship.lasers.push({
      x: ship.x + (4 / 3) * ship.r * Math.cos(ship.a),
      y: ship.y - (4 / 3) * ship.r * Math.sin(ship.a),
      xv: (LASER_SPD * Math.cos(ship.a)) / FPS,
      yv: (LASER_SPD * Math.sin(ship.a)) / FPS,
      dist: 0,
      explodeTime: 0,
    });
    fxLaser.play();
  }
  ship.canShoot = false;
}

// Main Game Update Function
function update() {
  var blinkOn = ship.blinkNum % 2 == 0;
  var exploding = ship.explodeTime > 0;

  //Use Neural Network
  if (AUTOMATION_ON) {
    // Compute closest asteroid
    let c = 0; // Closest Index
    let dist0 = distBetweenPoints(ship.x, ship.y, roids[0].x, roids[0].y);
    for (let i = 1; i < roids.length; i++) {
      let dist1 = distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y);
      if (dist1 < dist0) {
        dist0 = dist1; 
        c = i;
      }
    }


    // make prediction based on current data
    let ax = roids[c].x;
    let ay = roids[c].y;
    let sa = ship.a;
    let sx = ship.x;
    let sy = ship.y;
    // Experimental - TRACKING IMPROVEMENT
    let preAx = ax;
    let preAy = ay;
    let axv = roids[c].xv;
    let ayv = roids[c].yv;
    let angle = angleToTarget(sx, sy, ax, ay);
    let lxv = (LASER_SPD * Math.cos(angle)) / FPS;
    let lyv = (LASER_SPD * Math.sin(angle)) / FPS;
    
    let time = (distBetweenPoints(ax, ay, sx + (4 / 3) * (SHIP_SIZE / 2) * Math.cos(sa), sy - (4 / 3) * (SHIP_SIZE / 2) * Math.sin(sa)) / LASER_SPD) * FPS;
    if (distBetweenPoints(ax, ay, sx, sy) > 60) {
    preAx = ax + (axv * time);
    preAy = ay + (ayv * time);
    }
    
    let aimAngle = angleToPoint(sx, sy, sa, preAx, preAy);
    
    let predict = nn.feedForward(normaliseInput(ax, ay, angle, sa, aimAngle, lxv, lyv, axv, ayv)).data[0][0];

    if (TURRET_MODE) {
    // Make Turn
    let dLeft = Math.abs(predict - OUTPUT_LEFT);
    let dRight = Math.abs(predict - OUTPUT_RIGHT);
    if (dLeft < OUTPUT_THRESHOLD) {
      rotateShip(false);
    } else if (dRight < OUTPUT_THRESHOLD) {
      rotateShip(true);
    } else {
      ship.rot = 0;
    }

    // Pew
     if (aiShootTime == 0) {
       aiShootTime = Math.ceil(FPS / RATE_OF_FIRE);
       ship.canShoot = true;
       shootLaser();
     } else {
       aiShootTime--;
     }
    } else if (TURRET_MODE) {

    }
  }

  //Music tick
  music.tick();

  // Draws Space
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Draw Asteroids
  var x, y, r, a, vert, offs;
  for (var i = 0; i < roids.length; i++) {
    ctx.strokeStyle = "magenta";
    ctx.lineWidth = SHIP_SIZE / 20;
    ctx.shadowBlur = 5;
    ctx.shadowColor = "magenta";
    //Get Properties
    x = roids[i].x;
    y = roids[i].y;
    r = roids[i].r;
    a = roids[i].a;
    vert = roids[i].vert;
    offs = roids[i].offs;
    // Draw Path
    ctx.beginPath();
    ctx.moveTo(x + r * offs[0] * Math.cos(a), y + r * offs[0] * Math.sin(a));
    // Draw Polygon
    for (var j = 1; j < vert; j++) {
      ctx.lineTo(
        x + r * offs[j] * Math.cos(a + (j * Math.PI * 2) / vert),
        y + r * offs[j] * Math.sin(a + (j * Math.PI * 2) / vert)
      );
    }
    ctx.closePath();
    ctx.stroke();
    //Asteroid Movement
    roids[i].x += roids[i].xv;
    roids[i].y += roids[i].yv;
    //Handle Screen Edge
    if (roids[i].x < 0 - roids[i].r) {
      roids[i].x = WIDTH + roids[i].r;
    } else if (roids[i].x > WIDTH + roids[i].r) {
      roids[i].x = 0 - roids[i].r;
    }
    if (roids[i].y < 0 - roids[i].r) {
      roids[i].y = HEIGHT + roids[i].r;
    } else if (roids[i].y > HEIGHT + roids[i].r) {
      roids[i].y = 0 - roids[i].r;
    }
    // Asteroid Collision Circle
    if (SHOW_BOUNDING) {
      ctx.strokeStyle = "magenta";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
      ctx.stroke();
    }
  }

  // Draw Ship
  if (!exploding) {
    if (blinkOn && !ship.destroyed) {
      drawShip(ship.x, ship.y, ship.a);
    }
    // Handle Blinking
    if (ship.blinkNum > 0) {
      // Lower Blink Time
      ship.blinkTime--;
      if (ship.blinkTime == 0) {
        ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
        ship.blinkNum--;
      }
    }
  } else {
    ctx.shadowBlur = 40;
    ctx.shadowColor = "white";
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 1.5, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 1.2, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 0.7, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 0.4, 0, Math.PI * 2, false);
    ctx.fill();
  }
  // Rotate Ship
  ship.a += ship.rot;
  //Keep angle between 0 and 360
  if (ship.a < 0) {
    ship.a += (Math.PI * 2);
  } else if (ship.a >= (Math.PI * 2)) {
    ship.a -= (Math.PI * 2);
  }
  // Move Ship
  ship.x += ship.thrust.x;
  ship.y += ship.thrust.y;
  // Handle Edge of Canvas for ship
  if (ship.x < 0 - ship.r) {
    ship.x = WIDTH + ship.r;
  } else if (ship.x > WIDTH + ship.r) {
    ship.x = 0 - ship.r;
  }
  if (ship.y < 0 - ship.r) {
    ship.y = HEIGHT + ship.r;
  } else if (ship.y > HEIGHT + ship.r) {
    ship.y = 0 - ship.r;
  }
  // Ship Thrusters
  if (ship.thrusting && !ship.destroyed) {
    ship.thrust.x += (SHIP_THRUST * Math.cos(ship.a)) / FPS;
    ship.thrust.y -= (SHIP_THRUST * Math.sin(ship.a)) / FPS;
    fxThrust.play();

    if (!exploding && blinkOn) {
      // Draw Thruster
      ctx.shadowBlur = 16;
      ctx.shadowColor = "magenta";
      ctx.fillStyle = "purple";
      ctx.strokeStyle = "magenta";
      ctx.linewidth = SHIP_SIZE / 10;
      ctx.beginPath();
      ctx.moveTo(
        // 0.5 brings thruster toward center
        //Rear Left
        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.4 * Math.sin(ship.a)),
        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.4 * Math.cos(ship.a))
      );
      ctx.lineTo(
        //Behind Ship
        ship.x - ship.r * (5.5 / 3) * Math.cos(ship.a), // 5/3 multipler adjust thruster length
        ship.y + ship.r * (5.5 / 3) * Math.sin(ship.a)
      );
      ctx.lineTo(
        //Rear Right
        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.4 * Math.sin(ship.a)),
        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.4 * Math.cos(ship.a))
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else {
    ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS;
    ship.thrust.y -= (FRICTION * ship.thrust.y) / FPS;
    fxThrust.stop();
  }
  // Draw Laser
  for (var i = 0; i < ship.lasers.length; i++) {
    if (ship.lasers[i].explodeTime == 0) {
      ctx.fillStyle = "lime";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "lime";
      ctx.beginPath();
      ctx.arc(
        ship.lasers[i].x,
        ship.lasers[i].y,
        SHIP_SIZE / 15,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
    } else {
      //Laser Explosion
      ctx.shadowBlur = 7;
      ctx.shadowColor = "lime";
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(
        ship.lasers[i].x,
        ship.lasers[i].y,
        ship.r * 0.75,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.fillStyle = "greenyellow";
      ctx.beginPath();
      ctx.arc(
        ship.lasers[i].x,
        ship.lasers[i].y,
        ship.r * 0.5,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.fillStyle = "limegreen";
      ctx.beginPath();
      ctx.arc(
        ship.lasers[i].x,
        ship.lasers[i].y,
        ship.r * 0.3,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
    }
  }
  // Move Laser
  for (var i = ship.lasers.length - 1; i >= 0; i--) {
    // Check Dist Travelled
    if (ship.lasers[i].dist > LASER_DIST * WIDTH) {
      // Remove lasers that travel too far
      ship.lasers.splice(i, 1);
      continue;
    }

    // Explosion Handling
    if (ship.lasers[i].explodeTime > 0) {
      ship.lasers[i].explodeTime--;
      // Laser bye bye after explosion
      if (ship.lasers[i].explodeTime == 0) {
        ship.lasers.splice(i, 1);
        continue;
      }
    } else {
      // Moves Laser
      ship.lasers[i].x += ship.lasers[i].xv;
      ship.lasers[i].y -= ship.lasers[i].yv;

      // Calc dist travelled
      ship.lasers[i].dist += Math.sqrt(
        Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2)
      );
    }
    // handle screen edge
    if (ship.lasers[i].x < 0) {
      ship.lasers[i].x = WIDTH;
    } else if (ship.lasers[i].x > WIDTH) {
      ship.lasers[i].x = 0;
    }
    if (ship.lasers[i].y < 0) {
      ship.lasers[i].y = HEIGHT;
    } else if (ship.lasers[i].y > HEIGHT) {
      ship.lasers[i].y = 0;
    }
  }

  // Draw Lives
  var lifeColor;
  for (var i = 0; i < lives; i++) {
    lifeColor = exploding && i == lives - 1 ? "red" : "aqua";
    drawShip(
      SHIP_SIZE + i * SHIP_SIZE * 1.2,
      SHIP_SIZE,
      0.5 * Math.PI,
      lifeColor
    );
  }
  // Draw Score
  ctx.shadowBlur = 5;
  ctx.shadowColor = "magenta";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.font = "small-caps " + TEXT_SIZE + "px" + ' "Orbitron"';
  ctx.fillText(score, WIDTH / 2 - SHIP_SIZE / 2, SHIP_SIZE);
  // Draw High Score
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.shadowBlur = 3;
  ctx.shadowColor = "magenta";
  ctx.font = "small-caps " + 0.5 * TEXT_SIZE + "px" + '  "Orbitron"';
  ctx.fillText(
    "Top Score: " + scoreHigh,
    WIDTH - SHIP_SIZE / 2,
    SHIP_SIZE
  );
  // Draw Text
  if (textAlpha >= 0) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
    ctx.font = "small-caps " + TEXT_SIZE + "px" + ' "Orbitron"';
    ctx.fillText(text, WIDTH / 2, HEIGHT * 0.25);
    textAlpha -= 1.0 / TEXT_FADE_TIME / FPS;
  } else if (ship.destroyed) {
    playAgain.classList.remove("hidden");
    // newGame();
  }

  // Ship Collision Circle
  if (SHOW_BOUNDING) {
    ctx.strokeStyle = "magenta";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
    ctx.stroke();
  }
  // Center Dot of Ship
  if (SHOW_CENTER) {
    ctx.fillStyle = "aqua";
    ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
  }
  // Collision Check
  if (!exploding) {
    if (ship.blinkNum == 0 && !ship.destroyed) {
      // COLLISION CHECKER
      for (var i = 0; i < roids.length; i++) {
        if (
          distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) <
          ship.r + roids[i].r
        ) {
          explodeShip();
          destroyAsteroid(i);
          break;
        }
      }
    }
  } else {
    ship.explodeTime--;
// Lose a life after every ship explosion
    if (ship.explodeTime == 0) {
      lives--;
      if (lives == 0) {
        gameOver();
      } else {
        ship = newShip();
      }
    }
  }
  // Detect Laser Collision
  var ax, ay, ar, lx, ly;
  for (var i = roids.length - 1; i >= 0; i--) {
    // Grab properties
    ax = roids[i].x;
    ay = roids[i].y;
    ar = roids[i].r;

    for (var j = ship.lasers.length - 1; j >= 0; j--) {
      lx = ship.lasers[j].x;
      ly = ship.lasers[j].y;

      if (
        ship.lasers[j].explodeTime == 0 &&
        distBetweenPoints(ax, ay, lx, ly) < ar
        // if distance between pts function returns less than asteroid radius, it was a hit
      ) {
        destroyAsteroid(i);
        ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_DUR * 30);

        break;
      }
    }
  }
}


// NEURAL NETWORK
const LOG_ON = true; // Wether or not to show error logging
const LOG_FREQ = 20000; // How Often to show error logs in iterations

// NEURAL NETWORK
class NeuralNetwork {
    constructor(numInputs, numHidden, numOutputs) {
        this._inputs = [];
        this._hidden = [];
        this._numInputs = numInputs;
        this._numHidden = numHidden;
        this._numOutputs = numOutputs;
        this._bias0 = new Matrix(1, this._numHidden);
        this._bias1 = new Matrix(1, this._numOutputs);
        this._weights0 = new Matrix(this._numInputs, this._numHidden);
        this._weights1 = new Matrix(this._numHidden, this._numOutputs);

        // error logging
        this._logCount = LOG_FREQ;

        // Randomize Weights
        this._bias0.randomWeights();
        this._bias1.randomWeights();
        this._weights0.randomWeights();
        this._weights1.randomWeights();
    }

    get bias0() {
        return this._bias0;
    }

    set bias0(bias) {
        this._bias0 = bias;
    }
    get bias1() {
        return this._bias1;
    }

    set bias1(bias) {
        this._bias1 = bias;
    }

    get hidden() {
        return this._hidden;
    }

    set hidden(hidden) {
        this._hidden = hidden;
    }
    
    get inputs() {
        return this._inputs;
    }

    set inputs(inputs) {
        this._inputs = inputs;
    }

    get weights0() {
        return this._weights0;
    }

    set weights0(weights) {
        this._weights0 = weights;
    }

    get weights1() {
        return this._weights1;
    }
    
    set weights1(weights) {
        this._weights1 = weights;
    }

    get logCount() {
        return this._logCount;
    }
    
    set logCount(count) {
        this._logCount = count;
    }

    feedForward(inputArray) {
        //Convert to Matrix
        this.inputs = Matrix.convertFromArray(inputArray);

        // Find Hidden values and apply activation function
        this.hidden = Matrix.dot(this.inputs, this.weights0);

        this.hidden = Matrix.add(this.hidden, this.bias0); // Apply Bias
        this.hidden = Matrix.map(this.hidden, x => sigmoid(x));

        //Find Output values and apply activation
        let outputs = Matrix.dot(this.hidden, this.weights1);
        outputs = Matrix.add(outputs, this.bias1); // Apply Bias
        outputs = Matrix.map(outputs, x => sigmoid(x));
        // console.log("outputsSig");
        // console.table(outputs.data);

        return outputs;

        // Apply bias

    }

    // Train
    train(inputArray, targetArray) {
        // Feed Input Data
        let outputs = this.feedForward(inputArray);

        // Calculate Errors
        let targets = Matrix.convertFromArray(targetArray);
        let outputErrors = Matrix.subtract(targets, outputs);

        // Error Logging
        if (LOG_ON) {
            if (this.logCount == LOG_FREQ) {
                // console.log("error = " + outputErrors.data[0][0]);
            }
            this.logCount--;
            if (this.logCount == 0) {
                this.logCount = LOG_FREQ;
            }
        }

        // Calculate the deltas
        let outputDerivs = Matrix.map(outputs, x => sigmoid(x, true));
        let outputDeltas = Matrix.multiply(outputErrors, outputDerivs);

        // Calc Hidden Layer Errors
        let weights1T = Matrix.transpose(this.weights1);
        let hiddenErrors = Matrix.dot(outputDeltas, weights1T);

        // Calculate the hidden deltas (errors * deriv of hidden)
        let hiddenDerivs = Matrix.map(this.hidden, x => sigmoid(x, true));
        let hiddenDeltas = Matrix.multiply(hiddenErrors, hiddenDerivs);

        // Update Weights
        let hiddenT = Matrix.transpose(this.hidden);
        this.weights1 = Matrix.add(this.weights1, Matrix.dot(hiddenT, outputDeltas));
        let inputsT = Matrix.transpose(this.inputs);
        this.weights0 = Matrix.add(this.weights0, Matrix.dot(inputsT, hiddenDeltas));

        // Update Bias
        this.bias1 = Matrix.add(this.bias1, outputDeltas);
        this.bias0 = Matrix.add(this.bias0, hiddenDeltas);
    }
}

function sigmoid(x, deriv = false) {
    if (deriv) {
        return x * (1 - x); // Where x = sigmoid(x)
    }
    return 1 / (1 + Math.exp(-x))
}

// MATRIX FUNCTIONS
// **************************

class Matrix {
    constructor(rows, cols, data = []) {
        this._rows = rows;
        this._cols = cols;
        this._data = data;

        // Initialize with zero if no data provided
        if (data == null || data.length == 0) {
            this._data = [];
            for (let i = 0; i < this._rows; i++) {
                this._data[i] = [];
                for (let j = 0; j < this._cols; j++) {
                    this.data[i][j] = 0;
                }
            }
        } else {
        // Check Darta Integrity
        if (data.length != rows || data[0].length != cols) {
            throw new Error("Incorrect data dimensions!");
        }
        }
    }

    get rows() {
        return this._rows;
    }
    get cols() {
        return this._cols;
    }
    get data() {
        return this._data;
    }

    // Add Two Matrices
    static add(m0, m1) {
        Matrix.checkDimensions(m0, m1);
        let m = new Matrix(m0.rows, m0.cols);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                m.data[i][j] = m0.data[i][j] + m1.data[i][j];
            }
        }
        return m;
    }

    // Checkc Matricies for same dimensions
    static checkDimensions(m0, m1) {
        if (m0.rows != m1.rows || m0.cols != m1.cols) {
            throw new Error("Matrices are of different dimensions!");
        }
    }

    // Convert Array to One-Rowd Matrix
    static convertFromArray (arr) {
        return new Matrix(1, arr.length, [arr]);
    }

    // Dot Product
    static dot(m0, m1) {
        if (m0.cols != m1.rows) {
            throw new Error("Matricies are not dot compatible");
        }
        let m = new Matrix(m0.rows, m1.cols);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                let sum = 0;
                for (let k = 0; k < m0.cols; k++) {
                    sum += m0.data[i][k] * m1.data[k][j];
                }
                m.data[i][j] = sum;
            }
        }
        return m;
    }

    // Apply function to each cell of given matrix
    static map(m0, mFunction) {
        let m = new Matrix(m0.rows, m0.cols);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                m.data[i][j] = mFunction(m0.data[i][j]);
            }
        }
        return m;
    }

    // Multiply Two Matrices (Not DOT product)
    static multiply(m0, m1) {
        Matrix.checkDimensions(m0, m1);
        let m = new Matrix(m0.rows, m0.cols);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                m.data[i][j] = m0.data[i][j] * m1.data[i][j];
            }
        }
        return m;
    }

    // Subtract Two Matrices
    static subtract(m0, m1) {
        Matrix.checkDimensions(m0, m1);
        let m = new Matrix(m0.rows, m0.cols);
        for (let i = 0; i < m.rows; i++) {
            for (let j = 0; j < m.cols; j++) {
                m.data[i][j] = m0.data[i][j] - m1.data[i][j];
            }
        }
        return m;
    }
    
    // Find the transpose of the given matrix
    static transpose(m0) {
        let m = new Matrix(m0.cols, m0.rows);
        for (let i = 0; i < m0.rows; i++) {
            for (let j = 0; j < m0.cols; j++) {
                m.data[j][i] = m0.data[i][j];
            }
        }
        return m;
    }

    // Apply Random Weights Between -1 and 1
    randomWeights() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.data[i][j] = Math.random() * 2 - 1;
            }
        }
    }
}

var nn, aiShootTime = 0;
function initializeAI() {


// Neural Network Setup

if (AUTOMATION_ON) {
  nn = new NeuralNetwork(NUM_INPUTS, NUM_HIDDEN, NUM_OUTPUTS);

  // Train the Network
  let ax, ay, sa, sx, sy, axv, ayv, lxv, lyv;
  for (let i = 0; i < NUM_SAMPLES; i++) {

    // random asteroid location (include off-screen data)
    ax = Math.random() * (WIDTH + ROIDS_SIZE) - ROIDS_SIZE / 2;
    ay = Math.random() * (HEIGHT + ROIDS_SIZE) - ROIDS_SIZE / 2;
    
    
  
    // Ships Angle
    sa = Math.random() * Math.PI * 2;
    sx = ship.x;
    sy = ship.y;

    // Experimental - TRACKING IMPROVEMENT
    let aimAx, aimAy;
    axv = ((Math.random() * ROIDS_SPD) / FPS) *
    (Math.random() < 0.5 ? 1 : -1);
    ayv = ((Math.random() * ROIDS_SPD) / FPS) *
    (Math.random() < 0.5 ? 1 : -1);

    let angle = angleToTarget(sx, sy, ax, ay);
    lxv = (LASER_SPD * Math.cos(angle)) / FPS;
    lyv = (LASER_SPD * Math.sin(angle)) / FPS;
  
    aimAx = ax;
    aimAy = ay;
    let time = (distBetweenPoints(ax, ay, sx + (4 / 3) * (SHIP_SIZE / 2) * Math.cos(sa), sy - (4 / 3) * (SHIP_SIZE / 2) * Math.sin(sa)) / LASER_SPD) * FPS;
    if (distBetweenPoints(ax, ay, sx, sy) > 80) {
    aimAx = ax + (axv * time);
    aimAy = ay + (ayv * time);
    }

    // calc angle to asteroid
    let aimAngle = angleToPoint(sx, sy, sa, aimAx, aimAy);

    // Determine direction to turn
    let direction = aimAngle > Math.PI ? OUTPUT_LEFT : OUTPUT_RIGHT;

    // train the network
    nn.train(normaliseInput(ax, ay, angle, sa, aimAngle, lxv, lyv, axv, ayv), [direction]);
  }
  
}
}