var circle = function(){
  var x;
  var y;
  var r;
  var color;
  this.setAttributes = function(_x,_y,_r,_color){
    this.x = _x;
    this.y = _y;
    this.r = _r;
    this.color = _color;
  }
  this.draw = function(ctx){
    ctx.fillStyle(this.color);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
    ctx.fill();
  }
}
