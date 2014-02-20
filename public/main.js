function main() {
  var socket = io.connect("http://"+window.location.host);
  socket.on("log", function(data) {
    console.log(data);
  });
}

window.addEventListener("DOMContentLoaded", main);