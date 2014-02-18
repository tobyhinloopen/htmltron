var connect = require('connect');
var http = require('http');
var io = require('socket.io');
var app = connect().use(connect.static("./client"));
var server = http.createServer(app);
var io = io.listen(server);
server.listen(3000);

io.sockets.on("connection", function(socket) {
  console.log("connection!", socket);
});