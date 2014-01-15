var canvas = document.getElementById("game");
var deathCountSpan = document.getElementById("deathCount");
requestAnimationFrame(update);

var cellSize = 20;

var maze = [
  " #        ",
  " # # #### ",
  "   # #    ",
  "## # # ###",
  "   #     #",
  " #   # #  ",
  " # ### ## ",
  " ### ###  ",
  " #   # # #",
  "       #  ",
];
var goal = [maze.length-1, maze[0].length-1];

var manPosition, knownPits, deathCount;
reset();
function reset() {
  manPosition = [0,0];
  knownPits = [];
  deathCount = 0;
}

function update() {
  render();
  requestAnimationFrame(update);
}
var UP = 38, LEFT = 37, DOWN = 40, RIGHT = 39;
document.onkeydown = keyDown;
function keyDown(event) {
  var key = event.which;
  var lookingCell = manPosition.slice(0);
  switch (key) {
    case UP:    lookingCell[1]--; break;
    case LEFT:  lookingCell[0]--; break;
    case DOWN:  lookingCell[1]++; break;
    case RIGHT: lookingCell[0]++; break;
    default: return;
  }
  event.preventDefault();
  // oob
  if (lookingCell[0] < 0) return;
  if (lookingCell[1] < 0) return;
  if (lookingCell[0] > maze.length) return;
  if (lookingCell[1] > maze[0].length) return;
  // known pits
  if (knownPits.join("|").indexOf(lookingCell.toString()) !== -1) return;
  // the pit
  if (maze[lookingCell[0]][lookingCell[1]] !== " ") {
    knownPits.push(lookingCell);
    if (knownPits.length > 5) knownPits.shift();
    manPosition = [0,0];
    deathCount++;
    deathCountSpan.innerHTML = deathCount.toString();
    return;
  }
  manPosition = lookingCell;
  // goal?
  if (manPosition.toString() === goal.toString()) {
    alert("deaths: " + deathCount);
    reset();
    deathCountSpan.innerHTML = deathCount.toString();
  }
}

function render() {
  var context = canvas.getContext("2d");
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  function drawText(text, cell) {
    context.fillStyle = "#fff";
    context.font = (cellSize-2) + "pt Calibri";
    context.fillText(text, cell[0] * cellSize, cell[1] * cellSize + cellSize);
  }
  drawText("\u263b", manPosition);

  knownPits.forEach(function(pitPoint) {
    drawText("#", pitPoint);
  });

  drawText("\u2605", goal);
}
