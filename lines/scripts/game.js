'use strict';
window.onload = function(){
        prepareNewGame();
};

var XCoords = [];
var YCoords = [];
var additionalLines = [];
var initialLines = [];
var circles;
var canvas;
var context;

function prepareNewGame(){
    canvas = document.getElementById('gameCanvas');
    canvas.addEventListener('mousedown',boardClicked,false);
    context = canvas.getContext('2d');
    getCoords(15);
    drawCanvas(canvas);
}
function drawCanvas(){
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawLines(initialLines);
    drawLines(additionalLines);
    drawAllCircles();
}
function getCoords(gap){
    var h = canvas.height;
    var w = canvas.width;
    for(var i=5.5;i<h;i+=gap){
        YCoords.push(i);
        initialLines.push(new Line(new Point(0,i),new Point(w,i)));
    }
    for(i=5.5;i<w;i+=gap){
        XCoords.push(i);
        initialLines.push(new Line(new Point(i,0),new Point(i,h)));
    }
    circles = new Array(YCoords.length);
    for(i=0;i<YCoords.length;i++){
        circles[i] = new Array(XCoords.length);
        for(var j=0;j<XCoords.length;j++){
            circles[i][j] = 0; 
        }
    }
}
function fillLines(){
    var p1 = new Point(-1,-1);
    var p2 = new Point(-1,-1);
    var firstPoint = [];
    var secondPoint = [];
    for(var i=0;i<YCoords.length;i++){
        for(var j=0;j<XCoords.length;j++){
            if(circles[i][j] == 2){
                if(p1.x == -1){
                    p1 = new Point(XCoords[j],YCoords[i]);
                    firstPoint = [i,j];
                }
                else{
                    p2 = new Point(XCoords[j],YCoords[i]);
                    secondPoint = [i,j];
                    break;
                }
            }
        }
        if(p2.x != -1)break;
    }
    if(p2.x != -1){
        var line = new Line(p1,p2);
        additionalLines.push(line);
        circles[firstPoint[0]][firstPoint[1]] = 1;
        circles[secondPoint[0]][secondPoint[1]] = 1;
    }
}
function drawAllCircles(){
    for(var i=0;i<YCoords.length;i++){
        for(var j=0;j<XCoords.length;j++){
            if(circles[i][j] == 1)
                drawCircle(context,XCoords[j],YCoords[i],'black');
            else if(circles[i][j] == 2)
                drawCircle(context,XCoords[j],YCoords[i],'blue');
        }
    }
}
function drawLines(linesArray){
    linesArray.forEach(function(l){
        drawLine(context,l);
    });
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
    fillLines();
    drawCanvas(canvas);
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
