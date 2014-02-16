var canvas;
var c2d;
var current_time;

function render() {
  var x = (current_time % 500)/500*30;

  c2d.clearRect(0, 0, 640, 480);

  c2d.strokeStyle = "yellow";

  c2d.beginPath();
  c2d.moveTo(320.5, 480.5);
  c2d.lineTo(320.5, 240.5);
  c2d.lineTo(360.5, 240.5);
  c2d.lineTo(360.5, 320.5);
  c2d.lineTo(350.5 - x, 320.5);
  c2d.stroke();

  c2d.fillStyle = "yellow";
  c2d.fillRect(350 - x, 319, 7, 3);
}

function main() {
  canvas = document.getElementById("canvas");
  c2d = canvas.getContext("2d");
  current_time = null;
  requestAnimationFrame(next);
}

function next(t) {
  var delta = current_time == null ? 0 : (t - current_time);
  requestAnimationFrame(next);
  render();
  current_time = t;
}

document.addEventListener("DOMContentLoaded", main);
