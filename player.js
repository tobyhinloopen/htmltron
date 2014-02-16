function Player() {
  this.max_speed = 80;
  this.direction = 0;
  this.path = [];

  this.grid = 2;
  this.queue = [];
}

Player.MOVEMENTS = [
  { x: 0, y:-1 }, // north
  { x: 1, y: 0 }, // east
  { x: 0, y: 1 }, // south
  { x:-1, y: 0 }  // west
];

Player.prototype.right = function() {
  this.queue.push({
    incr: 1,
    time: performance.now()/1000
  });
};

Player.prototype.left = function() {
  this.queue.push({
    incr: 3,
    time: performance.now()/1000
  });
};

Player.prototype.get_movement = function() {
  return Player.MOVEMENTS[this.direction%4];
};

Player.prototype.get_current_position = function() {
  return this.path[this.path.length-1];
};

Player.prototype.add_point = function() {
  var p = this.get_current_position();
  this.path.push({ x: p.x, y: p.y });
}

Player.prototype.spawn = function(p) {
  this.path.push({ x: p.x, y: p.y }); // initial point
  this.add_point(); // 2nd & current point, to make a line
};

Player.prototype.update_position_by_delta = function(delta) {
  var pos = this.get_current_position();
  var mov = this.get_movement();
  pos.x += mov.x * this.max_speed * delta;
  pos.y += mov.y * this.max_speed * delta;
};

Player.prototype.update_position_to_next_grid_point = function(max_delta) {
  var pos = this.get_current_position();
  var mov = this.get_movement();
  var property = this.direction % 2 == 1 ? "x" : "y";

  var grid_progress = pos[property]/this.grid;
  var target_grid_progress = Math[mov[property] > 0 ? "ceil" : "floor"](grid_progress);
  if(grid_progress == target_grid_progress) {
    var prev_pos = this.path[this.path.length-2];
    if(prev_pos.x == pos.x && prev_pos.y == pos.y) {
      target_grid_progress += mov[property];
    }
  }
  var travel_distance = (target_grid_progress - grid_progress) * this.grid;
  var required_delta = Math.abs(travel_distance / this.max_speed);
  if(required_delta <= max_delta) {
    pos[property] = target_grid_progress * this.grid;
    return required_delta;
  } else {
    return -1;
  }
};

Player.prototype.update = function(start_time, end_time) {
  while(this.queue.length > 0 && this.queue[0].time <= end_time) {
    var q = this.queue[0];

    // first, update until the time the button was pressed.
    if(q.time > start_time) {
      this.update_position_by_delta(q.time - start_time);
      start_time = q.time;
    }

    // update to the next grid point, if possible.
    var traveled_delta = this.update_position_to_next_grid_point(end_time - start_time);
    if(traveled_delta < 0) {
      // not capable of traveling to the next point within the current delta.
      // ignore this queued item and just travel forward the rest of the time until the next update call.
      // break the loop so the final "update_position_by_delta" will handle the final travel distance.
      break;
    }

    this.queue.shift(); // pop the queued item as it is handled.
    start_time += traveled_delta;
    this.direction += q.incr;
    this.add_point();
  }

  this.update_position_by_delta(end_time - start_time);
};