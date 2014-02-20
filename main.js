var connect = require('connect');
var http = require('http');
var io = require('socket.io');
var app = connect().use(connect.static(__dirname+"/public"));

app.use(statusHandler);

var server = http.createServer(app);
var io = io.listen(server);
server.listen(3000);

var application_controller = new (require("./app/controllers/application_controller").ApplicationController)();

io.sockets.on("connection", function(socket) {
  application_controller.connect(socket);

  socket.on("disconnect", function() {
    application_controller.disconnect(socket);
  });
});

function statusHandler(req, res, next) {
  if(req.url == "/status") {
    var msg = "", ops = {
      Status: "OK",
      Games: application_controller.game_controllers.length,
      Clients: application_controller.clients.length
    };

    for(var x in ops) {
      if(ops.hasOwnProperty(x)) {
        msg += ("   ".substr(x.length-4, 4)) + x + ": " + ops[x] + "\r\n"
      }
    }

    res.writeHead(200, { "Content-Type": "text/plain", "Content-Length": msg.length });
    res.end(msg);
  } else {
    next();
  }
}