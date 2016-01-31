var Point = function(x,y){
    this.x = x;
    this.y = y;

    this.crossProduct = function(p1,p2){
        return ((this.y-p1.y)*(p2.x-p1.x)-(this.x-p1.x)*(p2.y-p1.y) == 0);
    }
};
