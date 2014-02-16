var canvas;
var c2d;
var current_time;
var player;

function render() {
  c2d.clearRect(0, 0, 640, 480);

  c2d.strokeStyle = "yellow";

  c2d.beginPath();
  c2d.moveTo(player.path[0].x + 0.5, player.path[0].y + 0.5);
  for(var i=1; i<player.path.length; i++) {
    c2d.lineTo(player.path[i].x + 0.5, player.path[i].y + 0.5);
  }
  c2d.stroke();

  c2d.fillStyle = "yellow";
  var p = player.get_current_position();
  if(player.direction % 2 == 1) {
    c2d.fillRect(p.x - 3, p.y - 1, 7, 3);
  } else {
    c2d.fillRect(p.x - 1, p.y - 3, 3, 7);
  }
}

function main() {
  canvas = document.getElementById("canvas");
  c2d = canvas.getContext("2d");
  player = new Player();
  player.spawn({ x: 320, y: 440 });
  Mousetrap.bind("z", function() { player.left();  });
  Mousetrap.bind("x", function() { player.right(); });
  current_time = null;
  requestAnimationFrame(next);
}

function next(t) {
  var delta = current_time == null ? 0 : (t - current_time) / 1000;
  requestAnimationFrame(next);
  player.update(delta);
  render();
  current_time = t;
}

document.addEventListener("DOMContentLoaded", main);
