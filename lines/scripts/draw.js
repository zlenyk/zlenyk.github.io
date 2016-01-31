
function drawLine(canvas,line,width,color){
    var context = canvas.getContext('2d');
    context.fillStyle = color;
    context.strokeStyle = color;
    context.beginPath();
    var p1 = line.p1;
    var p2 = line.p2;
    context.moveTo(p1.x,p1.y); 
    context.lineTo(p2.x,p2.y);
    context.lineWidth = width;
    context.stroke();
    context.closePath();  
} 
function drawCircle(canvas,x,y,color){
    var context = canvas.getContext('2d');
    var radius = 2;
    context.beginPath();
    context.arc(x,y,radius,0,2*Math.PI,false);
    context.fillStyle = color;
    context.fill();
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.stroke();
}
