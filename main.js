var canvas;
var c2d;

function render() {
  c2d.clearRect(0, 0, 640, 480);

  c2d.strokeStyle = "yellow";

  c2d.beginPath();
  c2d.moveTo(320.5, 480.5);
  c2d.lineTo(320.5, 240.5);
  c2d.lineTo(360.5, 240.5);
  c2d.lineTo(360.5, 320.5);
  c2d.lineTo(330.5, 320.5);
  c2d.stroke();

  c2d.fillStyle = "yellow";
  c2d.fillRect(330, 319, 7, 3);
}

function main() {
  canvas = document.getElementById("canvas");
  c2d = canvas.getContext("2d");
  render();
}

document.addEventListener("DOMContentLoaded", main);
