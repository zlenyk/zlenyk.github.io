function board(){
    this.width = 300;
    this.height = 300;
    this.bouncer = new rect('purple',70,10);
    var gap = 0;
    this.bouncerpositionx = this.width/2-this.bouncer.sizex/2;
    this.bouncerpositiony = this.height-this.bouncer.sizey-gap;
    this.movebouncer = function(x){
        this.bouncerpositionx += x;
        this.bouncerpositionx = math.max(0,this.bouncerpositionx);
        this.bouncerpositionx = math.min(this.width-this.bouncer.sizex,this.bouncerpositionx);
    }
}
