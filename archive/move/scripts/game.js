window.addEventListener('keydown', doKeyDown, true);
var canvas;
var ctx;
var board;
var drawer;
var sizeX = 300;
var sizeY = 300;
var bouncerHeight = 10;
var bouncerWidth = 70;
var gap = 0;
function prepare(){
    canvas = document.getElementById("gameCanvas");
    canvas.width = sizeX;
    canvas.height = sizeY;
    ctx = canvas.getContext("2d");

    drawer = new Drawer(canvas);
    board = new Board();

    drawer.draw(board);
}
function doKeyDown(e) {
    if ( e.keyCode == 65 ) {
        board.moveBouncer(-10);
    }
    if ( e.keyCode == 68 ) {
        board.moveBouncer(10);
    }
    drawer.draw(board);
}
