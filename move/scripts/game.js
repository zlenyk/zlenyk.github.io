window.addEventListener('keydown', doKeyDown, true);
var canvas;
var ctx;
var rect;
var drawer;
function prepare(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    try{
    drawer = new Drawer(canvas);
    rect = new Rect('purple',100,100,30,30);
    }catch(err){ alert(err); }
}
function doKeyDown(e) {
    if ( e.keyCode == 87 ) {
        rect.move(0,-10);
    }
    if ( e.keyCode == 83 ) {
        rect.move(0,10);
    }
    if ( e.keyCode == 65 ) {
        rect.move(-10,0);
    }
    if ( e.keyCode == 68 ) {
        rect.move(10,0);
    }
    drawer.draw(rect);
}
