var Line = function(p1,p2){
    this.p1 = p1;
    this.p2 = p2;
    this.lineOnOther = function(l){
        if(
                p1.crossProduct(l.p1,l.p2) && 
                p2.crossProduct(l.p1,l.p2) && 
                ((this.p1.x > l.p1.x && this.p1.x < l.p2.x) ||
                 (this.p1.y > l.p1.y && this.p1.y < l.p2.y) ||
                 (this.p2.x > l.p1.x && this.p2.x < l.p2.x) ||
                 (this.p2.y > l.p1.y && this.p2.y < l.p2.y))
          )
            return true;
    }
    this.areSame = function(l){
        return (this.p1 == l.p1 && this.p2 == l.p2);
    }
};
