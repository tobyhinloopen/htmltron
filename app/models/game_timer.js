var NanoTimer = require('../../vendor/nano_timer');
var Set = require("collections/set");

var GameTimer = this.GameTimer = function() {
  this.timer = new NanoTimer();
  this.games = new Set();
  this.interval = 100;
  this.time = 0;
};

GameTimer.prototype.add_game = function(game) {
  this.games.add(game);
};

GameTimer.prototype.remove_game = function(game) {
  this.games.delete(game);
};

GameTimer.prototype.next = function() {
  var start = this.time,
      end = this.time += this.interval,
      iterator = this.games.iterate(),
      game;
  while(game = iterator.next()) {
    game.update(start, end);
  }
};

GameTimer.prototype.start = function() {
  var self = this;
  this.timer.setInterval(function() {
    self.next();
  }, this.interval+'m');
};