
function drawLine(canvas,line,width,color,offsetX,offsetY){
    var context = canvas.getContext('2d');
    context.fillStyle = color;
    context.strokeStyle = color;
    context.beginPath();
    var p1 = line.p1;
    var p2 = line.p2;
    if(p1.x == p2.x){
        if(p1.x+offsetX < 0 || p1.x+offsetX > canvas.width){
            return;
        }
    }
    if(p1.y == p2.y){
        if(p1.y+offsetY < 0 || p1.y+offsetY > canvas.height)
            return;
    }
    context.moveTo(p1.x+offsetX,p1.y+offsetY); 
    context.lineTo(p2.x+offsetX,p2.y+offsetY);
    context.lineWidth = width;
    context.stroke();
    context.closePath();  
} 
function drawCircle(canvas,x,y,color,radius,offsetX,offsetY){
    if(x+offsetX > canvas.width || x+offsetX < 0 || y+offsetY > canvas.height || y+offsetY < 0)
        return;
    var context = canvas.getContext('2d');
    context.beginPath();
    context.arc(x+offsetX,y+offsetY,radius,0,2*Math.PI,false);
    context.fillStyle = color;
    context.fill();
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.stroke();
}
