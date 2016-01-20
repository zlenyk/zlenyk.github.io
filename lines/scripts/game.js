window.onload = function(){
        prepareNewGame();   
}

function prepareNewGame(){
    var canvas = document.getElementById('gameCanvas');
    drawAllLines(canvas,12);
}
function drawAllLines(canvas,gap){
    var context = canvas.getContext('2d');
    var h = canvas.height;
    var w = canvas.width;
    for(var i=5.5 ; i<w ; i+=gap){
        drawLine(context,0,i,h,i);
    }
    for(var i=5.5 ; i<w ; i+=gap){
        drawLine(context,i,0,i,h);
    }
    
}
function drawLine(context,x1,y1,x2,y2){
    context.fillStyle = '#000';
    context.strokeStyle = '#000';
    context.beginPath();
    context.moveTo(x1, y1); 
    context.lineTo(x2, y2);
    context.lineWidth = 1;
    context.stroke();
    context.closePath();  
} 
function drawCircle(context,x,y){
    var radius = 2;
    context.beginPath();
    context.arc(x,y,radius,0,2*Math.PI,false);
    context.fillStyle = 'black';
    context.fill();
    context.stroke();
}
