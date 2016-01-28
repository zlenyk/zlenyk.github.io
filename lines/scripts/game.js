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
var dotMove; //true,false (is now a dot or line move)
var score;
var lastDot;
var initialPoints = [[1,-1],[2,-1],[3,-1],[4,-1],[4,0],[4,1],[4,2],
    [3,2],[2,2],[1,2],[1,3],[1,4],[1,5],[0,5],[-1,5],[-2,5],[-2,4],[-2,3],
    [-2,2],[-3,2],[-4,2],[-5,2],[-5,1],[-5,0],[-5,-1],[-4,-1],[-3,-1],[-2,-1],
    [-2,-2],[-2,-3],[-2,-4],[-1,-4],[0,-4],[1,-4],[1,-3],[1,-2] ];
function prepareNewGame(){
    XCoords = [];
    YCoords = [];
    additionalLines = [];
    initialLines = [];
    lastDot = [-1,-1];
    canvas = document.getElementById('gameCanvas');
    canvas.addEventListener('mousedown',boardClicked,false);
    context = canvas.getContext('2d');
    dotMove = true;
    getCoords(15);
    prepareCirclesArray();
    drawCanvas(canvas);
    score = 0;
    refreshScore();
}
function undoLastDot(){
    if(lastDot[0] != -1 && !dotMove){
        circles[lastDot[0]][lastDot[1]] = 0;
        for(var i=0;i<YCoords.length;i++)
            for(var j=0;j<XCoords.length;j++)
                if(circles[i][j] == 2) circles[i][j] = 1;
        lastDot = [-1,-1];
        dotMove = !dotMove;
        drawCanvas();
    }
}
function prepareCirclesArray(){
    circles = new Array(YCoords.length);
    for(var i=0;i<YCoords.length;i++){
        circles[i] = new Array(XCoords.length);
        for(var j=0;j<XCoords.length;j++){
            circles[i][j] = 0; 
        }
    }
    for(i=0;i<initialPoints.length;i++){
        circles[YCoords.length/2+initialPoints[i][0]][XCoords.length/2+initialPoints[i][1]] = 1;
    }
}
function drawCanvas(){
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawLines(initialLines,1);
    drawAllCircles();
    drawLines(additionalLines,2);
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
}
/* adding new lines to additionalLines when 2 points are selected
 *  never more than 2 points will be selected
 *  setting dotMove to lineMove when line is added
 */
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
        if(arePointsGood(firstPoint[0],firstPoint[1],secondPoint[0],secondPoint[1])){
            var line = new Line(p1,p2);
            if(arrayHasLine(additionalLines,line) == false){
                additionalLines.push(new Line(p1,p2));
                dotMove = !dotMove;
                score++;
                refreshScore();
            }
        }
        circles[firstPoint[0]][firstPoint[1]] = 1;
        circles[secondPoint[0]][secondPoint[1]] = 1;
    }
}
function refreshScore(){
   var div = document.getElementById('score');
   div.innerHTML = "Score: " + score;
}
function arrayHasLine(array,line){
    for(var i=0;i<array.length;i++){
        if(array[i].p1.x == line.p1.x &&
            array[i].p1.y == line.p1.y &&
            array[i].p2.x == line.p2.x &&
            array[i].p2.y == line.p2.y)
            return true;
    }
    return false;
}
/* return true if points are vertical,horizontal or 45
 *
 */
function arePointsGood(x1,y1,x2,y2){
    var xd = x1-x2;
    var yd = y1-y2;
    if(!((Math.abs(xd) == 4 || Math.abs(xd) == 0) &&
            (Math.abs(yd) == 4 || Math.abs(yd) == 0) &&
            (xd != 0 || yd != 0))) 
         return false;
    for(var i=1;i<=3;i++){
        if(circles[x2+(xd/4)*i][y2+(yd/4)*i] != 1){
            return false;
        }
    }
    return true;
}
/*
 * Just drawing circles from array circles
 */
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
/*
 *  Draw lines from argument array
 */
function drawLines(linesArray,width){
    linesArray.forEach(function(l){
        drawLine(context,l,width);
    });
}
/* Check what intersetcion was clicked,
 * allows dots to be drawn/colored when dotMove is true/false 
 * repaints board
 */
function boardClicked(event){
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    var indexClicked = checkLineClicked(x,y);
    if(indexClicked[0] > -1 && indexClicked[1] > -1){
        var value = circles[indexClicked[0]][indexClicked[1]]; 
        if(dotMove && value === 0){
            circles[indexClicked[0]][indexClicked[1]]++;
            lastDot = [indexClicked[0],indexClicked[1]];
            dotMove = !dotMove;
        }else if(!dotMove && value === 1){
            circles[indexClicked[0]][indexClicked[1]]++;
            if(circles[indexClicked[0]][indexClicked[1]] > 2)
                circles[indexClicked[0]][indexClicked[1]] = 1;
        }
    }
    fillLines();
    drawCanvas(canvas);
}
/* returns intersection that near coordinates(argument)
 *
 */
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
