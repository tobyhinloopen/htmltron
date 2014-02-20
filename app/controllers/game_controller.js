var Set = require("collections/set"),
    Game = require("../models/game").Game,
    Player = require("../models/player").Player;

var GameController = this.GameController = function(game_timer) {
  this.game = new Game(game_timer);
  this.clients = new Set();
  console.log("Added game controller...");
};

GameController.prototype.get_available_slots_count = function() {
  return this.game.get_available_slots_count();
};

GameController.prototype.get_players_count = function() {
  return this.game.get_players_count();
};

GameController.prototype.has_client = function(client) {
  return this.clients.contains(client);
};

GameController.prototype.add_client = function(client) {
  this.clients.add(client);
  client.player = new Player();
  this.game.add_player(client.player);
  console.log("Added client to game controller...");
};

GameController.prototype.remove_client = function(client) {
  if(this.clients.contains(client)) {
    this.clients.delete(client);
    this.game.remove_player(client.player);
    console.log("Removed client to game controller...");
  }
};

GameController.prototype.destroy = function() {
  this.game.game_timer.remove_game(this.game);
  console.log("Removed game controller...");
};
