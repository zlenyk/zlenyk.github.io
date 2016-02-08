'use strict';
window.onload = function(){
    prepareNewGame();
};

var canvas;
var dotMove; //true,false (is now a dot or line move)
var score;
var lastPoint;
var boardManager;

function prepareNewGame(){
    canvas = document.getElementById('gameCanvas');
    boardManager = new BoardManager(canvas);
    boardManager.init();
    boardManager.drawBoard();
    lastPoint - new Point(-1,-1);
    canvas.addEventListener('mousedown',boardClicked,false);
    dotMove = true;
    score = 0;
    refreshScore();
    getResults();
}
function help(){
    if(dotMove){
        boardManager.blinkPoint(boardManager.getClickablePoint());
    }
}
function instruction(){
    var but = document.getElementById("but");
    var div = document.getElementById("instructionText");
    if(but.value == "Instruction"){
        div.innerHTML = "The game constists of only two types of move that are done repeatedly one after another.<br />1) draw a dot somewhere on a board<br />2) join 5 consecutive dots to form a line (verticaly, horizontaly, 45deg)<br />For each line you get a point. The game will inform you when there is no more moves to be done.<br />You can click Help when you can not see where you can put a dot. Yellow dot will blink in a feasible place.<br />";
        but.value = "Hide";
    }
    else{
        div.innerHTML = "";
        but.value = "Instruction";
    }
}
function undoLastDot(){
    if(lastPoint.x != -1 && !dotMove){
        boardManager.erasePoint(lastPoint);
        lastPoint = new Point(-1,-1);
        dotMove = !dotMove;
        boardManager.flushCheck();
    }
}
function getResults(){
    $.ajax({
        type: 'POST',
        url: 'http://lineserver-zlenyk.rhcloud.com/',
        data: {},
        dataType: 'json',
        success: function(data){
            $('#results').html('BEST RESULTS: <br/>');
            for(var i=0;i<data.length;i++){
                $('#results').append(+data[i].RESULT+'<br/>');
            }
        },
    });
}
function endGame(){
    alert("Your score: "+score+"\n"+"Congratulations!");
    $.post('http://lineserver-zlenyk.rhcloud.com/submit',
            {
                name: 'name',
                result: score 
            },
            function(data){}
          )
        canvas.removeEventListener('mousedown',boardClicked,false);
}
function checkEndOfGame(){
    var p = boardManager.getClickablePoint();
    if(p.x == -1){
        return true;
    }
}
function refreshScore(){
    var div = document.getElementById('score');
    div.innerHTML = "Score: " + score;
}
function test(){
    var div = document.getElementById('test');
    div.innerHTML = '';
    var arr = boardManager.getPointsBetween(new Point(10,10),new Point(10,6)); 
    for(var i=0;i<arr.length;i++){
        div.innerHTML += arr[i].x + ' ' + arr[i].y + '\n';
    }
}
function playAutomatically(){
    var myInterval = setInterval(function(){
        if(dotMove){
            var p = boardManager.getClickablePoint();
            checkBoard(p);
        }
        else{
            var pA = boardManager.getPointsFormingLine();
            checkBoard((pA[0]));
            checkBoard(pA[1]);
            searchForNewLine();
        }
        if(checkEndOfGame()){
            clearInterval(myInterval);
            endGame();
        }
    }, 100);
}
/* Check what intersetcion was clicked,
 * allows dots to be drawn/colored when dotMove is true/false 
 * repaints board
 */
function boardClicked(event){
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    checkBoard(new Point(x,y));
    if(!dotMove){
        searchForNewLine();
        if(checkEndOfGame())
            endGame();
    }
}
function checkBoard(p){
    if(dotMove){
        var res=boardManager.drawNewPoint(p);
        if(res == true){
            dotMove = !dotMove;
            lastPoint = p;
        }
    }else if(!dotMove){
        boardManager.checkPoint(p);
    }
}
/* Checks if 2 points are added and tries to add line
*/
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
