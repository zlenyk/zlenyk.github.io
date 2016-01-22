var Point = function(x,y){
    this.x = x;
    this.y = y;
};
var Line = function(p1,p2){
    this.p1 = p1;
    this.p2 = p2;
};
function drawLine(context,line){
    context.fillStyle = '#000';
    context.strokeStyle = '#000';
    context.beginPath();
    var p1 = line.p1;
    var p2 = line.p2;
    context.moveTo(p1.x,p1.y); 
    context.lineTo(p2.x,p2.y);
    context.lineWidth = 1;
    context.stroke();
    context.closePath();  
} 
function drawCircle(context,x,y,color){
    var radius = 2;
    context.beginPath();
    context.arc(x,y,radius,0,2*Math.PI,false);
    context.fillStyle = color;
    context.fill();
    context.stroke();
}
