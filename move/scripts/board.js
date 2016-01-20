function Board(){
    this.width = 300;
    this.height = 300;
    this.bouncer = new Rect('purple',70,10);
    var gap = 0;
    this.bouncerPositionX = this.width/2-this.bouncer.sizeX/2;
    this.bouncerPositionY = this.height-this.bouncer.sizeY-gap;
    this.moveBouncer = function(x){
        this.bouncerPositionX += x;
        this.bouncerPositionX = Math.max(0,this.bouncerPositionX);
        this.bouncerPositionX = Math.min(this.width-this.bouncer.sizeX,this.bouncerPositionX);
    }
}
