var canvas;
var c2d;
var current_time;
var player;
var hit_test_machine;
var raf_id;
var current_message;
var respawn_on_hit;
var show_controls_hint;

function render() {
  c2d.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);

  c2d.strokeStyle = player.color;

  c2d.beginPath();
  c2d.moveTo(player.path[0].x + 0.5, player.path[0].y + 0.5);
  for(var i=1; i<player.path.length; i++) {
    c2d.lineTo(player.path[i].x + 0.5, player.path[i].y + 0.5);
  }
  c2d.stroke();

  c2d.fillStyle = player.color;
  var p = player.get_current_position();
  if(player.direction % 2 == 1) {
    c2d.fillRect(p.x - 3, p.y - 1, 7, 3);
  } else {
    c2d.fillRect(p.x - 1, p.y - 3, 3, 7);
  }

  render_message();
}

function render_message() {
  c2d.font = "14px monospace";
  var text_width = c2d.measureText(current_message).width;
  var x = -text_width/2;
  c2d.fillStyle = "rgba(0,0,0,0.2)";
  c2d.fillRect(x-4, -6, text_width+8, 20);
  c2d.fillStyle = "white";
  c2d.fillText(current_message, x, 8);
}

function hit_correction() {
  hit_test_machine.gather_players_hits();
  var hits = hit_test_machine.pop_hits();
  if(hits.length == 0) return;

  for(var i=0; i<hits.length; i++) {
    var hit = hits[i];
    var pos = hit.player.get_current_position();
    pos[hit.intersection_property] = hit.intersection_coord;
    hit.player.max_speed = 0;
    render();
    if(respawn_on_hit) {
      start();
    } else {
      throw new Error("Game over");
    }
  }
}

function resize() {
  //canvas.width = window.innerWidth;
  //canvas.height = window.innerHeight;
  c2d.setTransform(1, 0, 0, 1, Math.floor(canvas.width/2), Math.floor(canvas.height/2));
}

function update_message(msg) {
  current_message = msg;
  if(msg) render_message();
}

function find_match() {
  update_message("Connecting to match server...");
}

function controls_hint_callback() {
  if(show_controls_hint) {
    find_match();
    update_message("Good. Now, get some practice while we find some other players...");
    show_controls_hint = false;
  }
}

function start() {
  if(raf_id) cancelAnimationFrame(raf_id);
  hit_test_machine = new HitTestMachine();
  player = new Player();
  hit_test_machine.add_player(player);
  player.spawn({ x: 0, y: 240 });
  player.color = "rgba(255,255,0,0.5);"
  Mousetrap.bind(["z", "left" ], function() { controls_hint_callback(); player.left();  }, "keydown");
  Mousetrap.bind(["x", "right"], function() { controls_hint_callback(); player.right(); }, "keydown");
  current_time = null;
  raf_id = requestAnimationFrame(next);
}

function next(t) {
  t = t/1000; // convert to seconds
  player.update(current_time == null ? t : current_time, t);
  hit_correction();
  render();
  current_time = t;
  raf_id = requestAnimationFrame(next);
}

function main() {
  canvas = document.getElementById("canvas");
  c2d = canvas.getContext("2d");
  show_controls_hint = true;
  resize();
  update_message("Use Z and X or LEFT and RIGHT to control your line.");
  respawn_on_hit = true;
  start();
}

window.addEventListener("DOMContentLoaded", main);