function main() {
  var canvas = document.getElementById("canvas");
  var c2d = canvas.getContext("2d");

  c2d.fillStyle = "#222";
  c2d.fillRect(0, 0, 640, 480);
}

document.addEventListener("DOMContentLoaded", main);
