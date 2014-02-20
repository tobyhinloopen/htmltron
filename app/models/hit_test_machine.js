var Set = require("collections/set");

var HitTestMachine = this.HitTestMachine = function() {
  this.horizontal_paths = [];
  this.vertical_paths = [];
  this.players = new Set();
  this.hit_players = new Set();
  this.hits = [];
};

HitTestMachine.prototype.pop_hits = function() {
  this.hit_players.clear();
  var hits = this.hits;
  this.hits = [];
  return hits;
};

HitTestMachine.prototype.add_player = function(player) {
  this.players.add(player);
  for(var i=0; i<player.path.length-1; i++) {
    this.add_path(player.path[i], player.path[i+1], player);
  }

  var htm = this;
  player.path_listener = function(p1, p2, horizontal) {
    htm[horizontal ? "horizontal_paths" : "vertical_paths"].push({ player: player, p1: p1, p2: p2 });
  };

  player.hittest_callback = function() {
    htm.gather_player_hits(player);
  };
};

HitTestMachine.prototype.remove_player = function(player) {
  this.players.delete(player);
  this.hit_players.delete(player);
  var i;
  for(i=0; i<this.hits.length; i++) {
    if(this.hits[i].player == player || this.hits[i].other_player == player) {
      this.hits.splice(i, 1);
      i--;
    }
  }
  for(i=0; i<this.horizontal_paths.length; i++) {
    if(this.horizontal_paths[i].player == player) {
      this.horizontal_paths.splice(i, 1);
      i--;
    }
  }
  for(i=0; i<this.vertical_paths.length; i++) {
    if(this.vertical_paths[i].player == player) {
      this.vertical_paths.splice(i, 1);
      i--;
    }
  }
};

HitTestMachine.prototype.add_path = function(p1, p2, player) {
  if(p1.x != p2.x && p1.y == p2.y) {
    this.horizontal_paths.push({ player: player, p1: { x: Math.min(p1.x, p2.x), y: p1.y }, p2: { x: Math.max(p1.x, p2.x), y: p1.y } });
  } else if(p1.y != p2.y && p1.x == p2.x) {
    this.vertical_paths.push({ player: player, p1: { y: Math.min(p1.y, p2.y), x: p1.x }, p2: { y: Math.max(p1.y, p2.y), x: p1.x } });
  } else if(p1.y != p2.y && p1.y != p2.y) {
    console.error("HitTestMachine can only handle vertical or horizontal lines...", p1, p2, player);
    throw new Error("Fatal error.");
  } else {
    console.info("Path not added: Path has 2 equal points not making a path.")
  }
};

HitTestMachine.prototype.gather_player_hits = function(player) {
  if(this.hit_players.contains(player)) {
    return true;
  }
  var p1 = player.path[player.path.length-2];
  var p2 = player.path[player.path.length-1];
  var player_movement_path = p1;
  var perpendicular_paths;
  var intersection_property;

  if(p1.x != p2.x && p1.y == p2.y) {
    // this is a horizontal path... Swap points if first point is "greater than" last point.
    if(p1.x > p2.x) {
      var _p1 = { x: p2.x, y: p2.y };
      p2 = { x: p1.x, y: p1.y };
      p1 = _p1;
    }
    perpendicular_paths = this.vertical_paths;
    intersection_property = "x";
  } else if(p1.y != p2.y && p1.x == p2.x) {
    // this is a vertical path... Swap points if first point is "greater than" last point. This is needed for the is_intersecting methods.
    if(p1.y > p2.y) {
      var _p1 = { y: p2.y, x: p2.x };
      p2 = { y: p1.y, x: p1.x };
      p1 = _p1;
    }
    perpendicular_paths = this.horizontal_paths;
    intersection_property = "y";
  } else if(p1.x == p2.x && p1.y == p2.y) {
    return; // 0-length path...
  } else {
    console.error("HitTestMachine can only handle vertical or horizontal lines...", p1, p2, player);
    throw new Error("Fatal error.");
  }

  for(var j=0; j<perpendicular_paths.length; j++) {
    var current_path = perpendicular_paths[j];
    if(!(player_movement_path.x == current_path.p1.x && player_movement_path.y == current_path.p1.y)
    && !(player_movement_path.x == current_path.p2.x && player_movement_path.y == current_path.p2.y)
    && HitTestMachine.is_intersecting_pair(current_path.p1, current_path.p2, p1, p2)) {
      this.hit_players.add(player);
      this.hits.push({ player: player, other_player: current_path.player, intersection_coord: current_path.p1[intersection_property], intersection_property: intersection_property });
      return true;
    }
  }

  return false;
}

HitTestMachine.prototype.gather_players_hits = function() {
  for(var i=0; i<this.players.length; i++) {
    if(!this.hit_players.contains(this.players[i]))
      this.gather_player_hits(this.players[i]);
  }
};

HitTestMachine.is_intersecting = function(a1, a2, b1, b2) {
  return a1 <= b1 && a2 >= b1 || a1 <= b2 && a2 >= b2 || a1 >= b1 && a1 <= b2 || a2 >= b1 && a2 <= b2;
};

HitTestMachine.is_intersecting_pair = function(a1, a2, b1, b2) {
  return HitTestMachine.is_intersecting(a1.x, a2.x, b1.x, b2.x) && HitTestMachine.is_intersecting(a1.y, a2.y, b1.y, b2.y);
};