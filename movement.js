var runner = new Image();
runner.src = "./assets/karakter/Biker_run.png"
var jump = new Image();
jump.src = './assets/karakter/Biker_jump.png'

// Define the animation frames
var frames = [
  { x: 0, y: 0, w:27, h: 35 },  // left
  { x: 27, y: 0, w:27, h: 35 }, // left
  { x: 54, y: 0, w:27, h: 35 }, // left
  { x: 108, y: 0, w:27, h: 35 }, // left
  { x: 0, y: 0, w: 48, h: 48 }, // right
  { x: 48, y: 0, w: 48, h: 48 }, // right
  { x: 48*2, y: 0, w: 48, h: 48 }, // right
  { x: 48*3, y: 0, w: 48, h: 48 }, // right
  { x: 0, y: 0, w: 48, h: 48 }, // up
  { x: 48, y: 0, w: 48, h: 48 }, // up
  { x: 48*2, y: 0, w: 48, h: 48 }, // up
  { x: 48*3, y: 0, w: 48, h: 48 }, // up
  { x: 0, y: 192, w: 64, h: 64 }, // down
  { x: 64, y: 192, w: 64, h: 64 }, // down
  { x: 128, y: 192, w: 64, h: 64 }, // down
  { x: 192, y: 192, w: 64, h: 64 } // down
];

// Create the player object and set its initial position
var player = {
  x: 0,
  y: 0,
  width: 48,
  height: 48,
  frameIndex: 4 // starting frame
};

// Set up the arrow key controls
let isJump=false
var keys = {
  left: false,
  right: false,
  up: false,
  down: false
};
document.addEventListener("keydown", function(event) {
  if (event.code === "ArrowLeft") {
    keys.left = true;
  }
  else if (event.code === "ArrowRight") {
    keys.right = true;
  }
  else if (event.code === "ArrowUp") {
    keys.up = true;
  }
  else if (event.code === "ArrowDown") {
    keys.down = true;
  }
});
document.addEventListener("keyup", function(event) {
  if (event.code === "ArrowLeft") {
    keys.left = false;
  }
  else if (event.code === "ArrowRight") {
    keys.right = false;
  }
  else if (event.code === "ArrowUp") {
    keys.up = false;
  }
  else if (event.code === "ArrowDown") {
    keys.down = false;
  }
});

// Set up the game loop
function loop() {
  // Update the player position based on the arrow keys
  player.frameIndex = 0
  if (keys.left) {
player.x -= 5;
player.frameIndex = 0 + (Math.floor(Date.now() / 100) % 4); // animate left frames
}
else if (keys.right) {
player.x += 5;
player.frameIndex = 4 + (Math.floor(Date.now() / 100) % 4); // animate right frames
}
else if (keys.up) {
isJump=true
player.y -= 5;
player.frameIndex = 8 + (Math.floor(Date.now() / 100) % 4); // animate up frames
}
else if (keys.down) {
player.y += 5;
player.frameIndex = 12 + (Math.floor(Date.now() / 100) % 4); // animate down frames
}

// Clear the canvas
var canvas = document.getElementById("myCanvas");
 var ctx = canvas.getContext("2d");

// Draw the player sprite
var frame = frames[player.frameIndex];
if(isJump ===true){
    ctx.drawImage(jump, frame.x, frame.y, frame.w, frame.h, player.x, player.y, player.width, player.height);

}
else{
    ctx.drawImage(runner, frame.x, frame.y, frame.w, frame.h, player.x, player.y, player.width, player.height);

}
console.log(isJump)
// Request the next animation frame
requestAnimationFrame(loop);
isJump=false
}
// Start the game loop
requestAnimationFrame(loop);