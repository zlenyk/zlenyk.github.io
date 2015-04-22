function Drawer(_canvas){
    this.canvas = _canvas;

    this.draw = function(rect){
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = rect.color;
        ctx.fillRect(rect.posX,rect.posY,rect.sizeX,rect.sizeY);
    }
}
