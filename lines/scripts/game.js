'use strict';
window.onload = function(){
        prepareNewGame();
};

var canvas;
var dotMove; //true,false (is now a dot or line move)
var score;
var lastDot;
var boardManager;

function prepareNewGame(){
    canvas = document.getElementById('gameCanvas');
    try{ 
    boardManager = new BoardManager(canvas);
    boardManager.init();
    boardManager.drawBoard();
    }catch(err){alert(err);}
    lastDot = [-1,-1];
    canvas.addEventListener('mousedown',boardClicked,false);
    dotMove = true;
    score = 0;
    refreshScore();
}
function undoLastDot(){
    if(lastDot[0] != -1 && !dotMove){
        boardManager.erasePoint(lastDot[0],lastDot[1]);
        lastDot = [-1,-1];
        dotMove = !dotMove;
        boardManager.flushCheck();
    }
}
function refreshScore(){
   var div = document.getElementById('score');
   div.innerHTML = "Score: " + score;
}
/* Check what intersetcion was clicked,
 * allows dots to be drawn/colored when dotMove is true/false 
 * repaints board
 */
function boardClicked(event){
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    var indexClicked = boardManager.checkLineClicked(x,y);
    if(indexClicked[0] > -1 && indexClicked[1] > -1){
        if(dotMove){
            var res=boardManager.drawNewPoint(indexClicked[0],indexClicked[1]);
            if(res == true){
               dotMove = !dotMove;
               lastDot = [indexClicked[0],indexClicked[1]];
            }
        }else if(!dotMove){
            boardManager.checkPoint(indexClicked[0],indexClicked[1]);
            searchForNewLine();
        }
    }
}
function searchForNewLine(){
    var indexPointsArray = boardManager.checkedPoints();
    if(indexPointsArray.length === 2){
        if(boardManager.addLine(indexPointsArray[0],indexPointsArray[1])){
            dotMove = !dotMove;
            score++;
            refreshScore();
        }
        boardManager.flushCheck();
    }

}
