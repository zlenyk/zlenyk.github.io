'use strict';
window.onload = function(){
        prepareNewGame();
};

var XCoords = [];
var YCoords = [];
var circles;
var canvas;
var context;
function prepareNewGame(){
    canvas = document.getElementById('gameCanvas');
    canvas.addEventListener('mousedown',boardClicked,false);
    context = canvas.getContext('2d');
    getCoords(15);
    drawCanvas();
}
function getCoords(gap){
    var h = canvas.height;
    var w = canvas.width;
    for(var i=5.5;i<h;i+=gap){
        YCoords.push(i);
    }
    for(i=5.5;i<w;i+=gap){
        XCoords.push(i);
    }
    circles = new Array(YCoords.length);
    for(i=0;i<YCoords.length;i++){
        circles[i] = new Array(XCoords.length);
        for(var j=0;j<XCoords.length;j++){
            circles[i][j] = 0; 
        }
    }
}
function drawCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawAllLines();
    drawAllCircles();
}
function drawAllCircles(){
    for(var i=0;i<YCoords.length;i++){
        for(var j=0;j<XCoords.length;j++){
            if(circles[i][j] == 1)
                drawCircle(XCoords[j],YCoords[i],'black');
            else if(circles[i][j] == 2)
                drawCircle(XCoords[j],YCoords[i],'blue');
        }
    }
}
function drawAllLines(){
    var h = canvas.height;
    var w = canvas.width;
    for(var i=0;i<YCoords.length;i++){
        drawLine(0,YCoords[i],w,YCoords[i]);
    }
    for(i=0;i<XCoords.length;i++){
        drawLine(XCoords[i],0,XCoords[i],h);
    }
}
function boardClicked(event){
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    var indexClicked = checkLineClicked(x,y);
    if(indexClicked[0] > -1 && indexClicked[1] > -1){
        circles[indexClicked[0]][indexClicked[1]]++;
        if(circles[indexClicked[0]][indexClicked[1]] > 2)
        circles[indexClicked[0]][indexClicked[1]] = 2;
    }
    drawCanvas();
}
function checkLineClicked(x,y){
    var mistake = 4;
    var Xclicked = -1;
    var Yclicked = -1;
    for(var i=0;i<XCoords.length;i++){
        if(Math.abs(XCoords[i]-x) <= mistake){
            Xclicked = i;
            break;
        }
    }
    for(i=0;i<YCoords.length;i++){
        if(Math.abs(YCoords[i]-y) <= mistake){
            Yclicked = i;
            break;
        }
    }
    return [Yclicked,Xclicked];
}
function drawLine(x1,y1,x2,y2){
    context.fillStyle = '#000';
    context.strokeStyle = '#000';
    context.beginPath();
    context.moveTo(x1, y1); 
    context.lineTo(x2, y2);
    context.lineWidth = 1;
    context.stroke();
    context.closePath();  
} 
function drawCircle(x,y,color){
    var radius = 2;
    context.beginPath();
    context.arc(x,y,radius,0,2*Math.PI,false);
    context.fillStyle = color;
    context.fill();
    context.stroke();
}
