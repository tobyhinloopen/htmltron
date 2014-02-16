function Player() {
  this.max_speed = 60;
  this.direction = 0;
  this.path = [];
}

Player.MOVEMENTS = [
  { x: 0, y:-1 }, // north
  { x: 1, y: 0 }, // east
  { x: 0, y: 1 }, // south
  { x:-1, y: 0 }  // west
];

Player.prototype.right = function() {
  this.direction++;
};

Player.prototype.left = function() {
  this.direction--;
};

Player.prototype.get_movement = function() {
  return Player.MOVEMENTS[this.direction%4];
};

Player.prototype.get_current_position = function() {
  return this.path[this.path.length-1];
};

Player.prototype.spawn = function(p) {
  this.path.push({ x: p.x, y: p.y }); // initial point
  this.path.push({ x: p.x, y: p.y }); // 2nd & current point, to make a line
};

Player.prototype.update = function(delta) {
  var pos = this.get_current_position();
  var mov = this.get_movement();
  pos.x += mov.x * this.max_speed;
  pos.y += mov.y * this.max_speed;
};