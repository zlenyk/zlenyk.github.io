function Drawer(_canvas){
    this.canvas = _canvas;

    this.draw = function(board){
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = board.bouncer.color;
        ctx.fillRect(board.bouncerPositionX,board.bouncerPositionY,board.bouncer.sizeX,board.bouncer.sizeY);
    }
}
