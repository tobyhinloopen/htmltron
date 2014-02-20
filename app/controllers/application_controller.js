var Set = require("collections/set"),
    Map = require("collections/map"),
    GameTimer = require("../models/game_timer").GameTimer,
    Client = require("../models/client").Client,
    GameController = require("./game_controller").GameController;

var ApplicationController = this.ApplicationController = function() {
  this.clients = new Map();
  this.game_timer = new GameTimer();
  this.game_controllers = new Set();
};

ApplicationController.prototype.find_and_join_available_game = function(client) {
  var game_controller, iterator = this.game_controllers.iterate();
  while(game_controller = iterator.next()) {
    if(game_controller.get_available_slots_count() > 0) {
      game_controller.add_client(client);
      return;
    }
  }
  var game_controller = new GameController(this.game_timer);
  this.game_controllers.add(game_controller);
  game_controller.add_client(client);
};

ApplicationController.prototype.connect = function(socket) {
  var client = new Client(socket);
  this.clients.set(socket, client);
  this.find_and_join_available_game(client);
};

ApplicationController.prototype.disconnect = function(socket) {
  var client = this.clients.get(socket);
  if(client.player && client.player.game) {
    var game_controller, iterator = this.game_controllers.iterate();
    while(game_controller = iterator.next()) {
      game_controller.remove_client(client);
      if(game_controller.get_players_count() == 0) {
        game_controller.destroy();
        this.game_controllers.delete(game_controller);
      }
    }
  }
  this.clients.delete(socket);
};