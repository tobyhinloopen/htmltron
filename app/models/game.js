var HitTestMachine = require("./hit_test_machine").HitTestMachine;
var GameTimer = require("./game_timer").GameTimer;
var Set = require("collections/set");

var Game = this.Game = function(game_timer) {
  this.game_timer = game_timer;
  this.game_timer.add_game(this);

  this.hit_test_machine = new HitTestMachine();
  this.players = new Set();
  this.max_players = 4;
};

Game.prototype.add_player = function(player) {
  player.game && player.game.remove_player(player);
  this.players.add(player);
  this.hit_test_machine.add_player(player);
  player.game = this;
};

Game.prototype.remove_player = function(player) {
  player.game = null;
  this.players.delete(player);
  this.hit_test_machine.remove_player(player);
};

Game.prototype.start = function() {
  this.start_time = this.game_timer.time;
};

Game.prototype.get_available_slots_count = function() {
  return this.max_players - this.players.length;
};

Game.prototype.get_players_count = function() {
  return this.players.length;
};
