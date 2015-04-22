function Rect(_color,_posX,_posY,_sizeX,_sizeY){
    this.posX = _posX;
    this.posY = _posY;
    this.sizeX = _sizeX;
    this.sizeY = _sizeY;
    this.color = _color;

    this.move = function(x,y){
         this.posX += x;
         this.posY += y;
    }
}
