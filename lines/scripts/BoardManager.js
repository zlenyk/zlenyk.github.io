var BoardManager = function(canvas){
    this.canvas = canvas; 
    this.initialLines = [];
    this.additionalLines = [];
    this.XCoords = [];
    this.YCoords = [];
    this.initialPoints = [[1,-1],[2,-1],[3,-1],[4,-1],[4,0],[4,1],[4,2],
    [3,2],[2,2],[1,2],[1,3],[1,4],[1,5],[0,5],[-1,5],[-2,5],[-2,4],[-2,3],
    [-2,2],[-3,2],[-4,2],[-5,2],[-5,1],[-5,0],[-5,-1],[-4,-1],[-3,-1],[-2,-1],
    [-2,-2],[-2,-3],[-2,-4],[-1,-4],[0,-4],[1,-4],[1,-3],[1,-2] ];
    this.circles = {};

    this.init = function(){
        this.getCoords(20);
        this.prepareCirclesArray();
    };
    /* Drawing board from arrays content
     */
    this.drawBoard = function(){
        var context = this.canvas.getContext('2d'); 
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawLines(this.initialLines,1,'black');
        this.drawLines(this.additionalLines,3,'#005100'); //dark green
        this.drawAllCircles();
    };
    /* filling coordinates arrays
     */
    this.getCoords = function(gap){
        var h = this.canvas.height;
        var w = this.canvas.width;
        for(var i=5.5;i<h;i+=gap){
            this.YCoords.push(i);
            this.initialLines.push(new Line(new Point(0,i),new Point(w,i)));
        }
        for(i=5.5;i<w;i+=gap){
            this.XCoords.push(i);
            this.initialLines.push(new Line(new Point(i,0),new Point(i,h)));
        }
    };
    /* return unchecked point between given points inclusively
     */
    this.getUncheckedPoint = function(p1,p2){
        var nArray = this.getPointsBetween(p1,p2);
        for(var i=0;i<nArray.length;i++){
            if(this.circles[nArray[i].x][nArray[i].y] != 1)
                return nArray[i];
        }
        return -1;
    };
    this.getPointsFormingLine = function(){
        for(var i=0;i<this.XCoords.length;i++){
            for(var j=0;j<this.YCoords.length;j++){
                var p = new Point(i,j);
                var goodNeighbour = this.checkNeighbourPoints(p,5);
                if(goodNeighbour.x != -1)
                    return [this.indexToCoords(p),this.indexToCoords(goodNeighbour)];
            }
        }
        return [-1,-1];
    };
    this.getTargetPoints = function(p){
        var tab = [[1,0],[0,1],[1,1],[1,-1]];
        var retArray = []; 
        for(var i=0;i<tab.length;i++){
            var newX = p.x+4*tab[i][0];
            var newY = p.y+4*tab[i][1];
            if(newX>=0 && newX<this.XCoords.length && newY>=0 && newY<this.YCoords.length)
                retArray.push(new Point(newX,newY));
        }
        return retArray;
    };
    /* True if in neighbourhood(5) of point lies given number of points
     * in on line and are not connected
     * return point to which it is done
     */
    this.checkNeighbourPoints = function(p1,number){
        var neighbours = this.getTargetPoints(p1);
        for(var i=0;i<neighbours.length;i++){
            var p2 = neighbours[i];
            var neighArray = this.getPointsBetween(p1,p2);
            var count = 0;
            for(var j=0;j<neighArray.length;j++){
                if(this.circles[neighArray[j].x][neighArray[j].y] == 1){
                    count++;
                }
            }
            if(count !== number) continue;
            var ok = true;
            for(j=0;j<neighArray.length-1;j++){
                if(this.arrayHasLine(
                            this.additionalLines,
                            new Line(this.indexToCoords(neighArray[j]),
                                    this.indexToCoords(neighArray[j+1])))){
                    ok = false;
                    break;
                }
            }
            if(!ok) continue;
            return p2;
        }
        return new Point(-1,-1);
    };
    this.getClickablePoint = function(){
        for(var i=0;i<this.XCoords.length;i++){
            for(var j=0;j<this.YCoords.length;j++){
                var p = new Point(i,j);
                var goodNeighbour = this.checkNeighbourPoints(p,4);
                if(goodNeighbour.x!=-1){
                    return this.indexToCoords(this.getUncheckedPoint(p,goodNeighbour));
                }
            }
        }
        return new Point(-1,-1);
    };
    this.checkAllPointsNeighbours = function(){
        return this.getClickablePoint().x != -1;
    };
    this.prepareCirclesArray = function(){
        this.circles = new Array(this.YCoords.length);
        for(var i=0;i<this.XCoords.length;i++){
            this.circles[i] = new Array(this.XCoords.length);
            for(var j=0;j<this.YCoords.length;j++){
                this.circles[i][j] = 0; 
            }
        }
        for(i=0;i<this.initialPoints.length;i++){
            this.circles[this.XCoords.length/2+this.initialPoints[i][0]][this.YCoords.length/2+this.initialPoints[i][1]] = 1;
        }
    };
    this.indexToCoords = function(p){
        return new Point(this.XCoords[p.x],this.YCoords[p.y]);
    };
    this.addLine = function(p1,p2){
        if(this.pointsFormGoodLine(p1,p2)){
            var coordsP1 = this.indexToCoords(p1);
            var coordsP2 = this.indexToCoords(p1);
            var line = new Line(this.indexToCoords(p1),this.indexToCoords(p2));
            if(this.arrayHasLine(this.additionalLines,line) === false){
                this.additionalLines.push(line);
                this.drawBoard();
                return true;
            }
        }
        return false;
    };
    /* returns array of points that lies between two given(inclusive)
     */
    this.getPointsBetween = function(p1,p2){
        var retArray = [];
        var xd = p2.x-p1.x;
        var yd = p2.y-p1.y;
        if(Math.abs(xd)!==Math.abs(yd) && Math.abs(xd)!==0 && Math.abs(yd)!==0){
            return retArray;
        }
        for(var i=0;i<=Math.max(Math.abs(xd),Math.abs(yd));i++){
            var p;
            var newX = p1.x;
            var newY = p1.y;
            if(xd !== 0){
                newX = p1.x+(i*xd)/Math.abs(xd); 
            }
            if(yd !== 0){
                newY = p1.y+(i*yd)/Math.abs(yd); 
            }
            if(newX>=0 && newX<this.XCoords.length && newY>=0 && newY<this.YCoords.length){
                retArray.push(new Point(newX,newY));
            }
        }
        return retArray;
    };
    this.pointsFormGoodLine = function(p1,p2){
        var retArray = this.getPointsBetween(p1,p2);
        if(retArray.length != 5) return false;
        for(var i=0;i<retArray.length;i++){
            if(this.circles[retArray[i].x][retArray[i].y] < 1){
                return false;
            }
        }
        return true;
    };
    /*  true if are on same line
     * */
    this.arrayHasLine = function(array,line){
        try{
        for(var i=0;i<array.length;i++){
            if(line.areSame(array[i]) || line.lineOnOther(array[i])){
                return true;
            }
        }
        }catch(err){alert(err);}
        return false;
    };
    /*
     * Just drawing circles from array circles
     */
    this.drawAllCircles = function(){
        for(var i=0;i<this.XCoords.length;i++){
            for(var j=0;j<this.YCoords.length;j++){
                if(this.circles[i][j] == 1)
                    drawCircle(this.canvas,this.XCoords[i],this.YCoords[j],'black',2);
                else if(this.circles[i][j] == 2){
                    drawCircle(this.canvas,this.XCoords[i],this.YCoords[j],'blue',2);
                }
                else if(this.circles[i][j] == 3){
                    drawCircle(this.canvas,this.XCoords[i],this.YCoords[j],'red',3);
                }
                
            }
        }
    };
    /*
     *  Draw lines from argument array
     */
    this.drawLines = function(linesArray,width,color){
        linesArray.forEach(function(l){
            drawLine(canvas,l,width,color);
        });
    };
    this.erasePoint = function(p){
        var r = this.pointClicked(p);
        var res = r[0];var indexP = r[1];
        var x = indexP.x;
        var y = indexP.y;
        if(this.circles[x][y] > 0){
            this.circles[x][y] = 0;
            this.drawBoard();
        }
    };
    this.drawNewPoint = function(p){
        var r = this.pointClicked(p);
        var res = r[0];var indexP = r[1];
        if(res === false) return false;
        var x = indexP.x;
        var y = indexP.y;
        if(this.circles[x][y] === 0){
            this.circles[x][y] = 1;
            this.drawBoard();
            return true;
        }
        return false;
    };
    this.checkPoint = function(p){
        var r = this.pointClicked(p);
        var res = r[0];var indexP = r[1];
        if(res === false) return false;
        var x = indexP.x;
        var y = indexP.y;
        if(this.circles[x][y] === 1){
            this.circles[x][y] = 2;
        }
        else if(this.circles[x][y] === 2){
            this.circles[x][y] = 1;
        }
        this.drawBoard();
        return true;
    };
    this.blinkPoint = function(p){
        var r = this.pointClicked(p);
        var res = r[0];var indexP = r[1];
        var blinked = false;
        var that = this;
        var myInterval = setInterval(function(){
            if(!blinked){
                try{
                blinked = true;
                that.circles[indexP.x][indexP.y] = 3;
                that.drawBoard();
                }catch(err){alert(err);}
            }
            else{
                that.circles[indexP.x][indexP.y] = 0;
                that.drawBoard();
                clearInterval(myInterval);
            }
        },500);
    };
    this.checkedPoints = function(){
        var res = [];
        for(var i=0;i<this.XCoords.length;i++){
            for(var j=0;j<this.YCoords.length;j++){
                if(this.circles[i][j] == 2){
                    res.push(new Point(i,j));
                }
            }
        }
        return res;
    };
    this.flushCheck = function(){
        for(var i=0;i<this.XCoords.length;i++){
            for(var j=0;j<this.YCoords.length;j++){
                if(this.circles[i][j] == 2){
                    this.circles[i][j] = 1;
                }
            }
        }
        this.drawBoard();
    };
    /* returns index point and res-if something is clicked 
     */
    this.pointClicked = function(p){
        var mistake = 5;
        var Xclicked = -1;
        var Yclicked = -1;
        var res = true;
        for(var i=0;i<this.XCoords.length;i++){
            if(Math.abs(this.XCoords[i]-p.x) <= mistake){
                Xclicked = i;
                break;
            }
        }
        for(i=0;i<this.YCoords.length;i++){
            if(Math.abs(this.YCoords[i]-p.y) <= mistake){
                Yclicked = i;
                break;
            }
        }
        if(Xclicked == -1 || Yclicked == -1) res = false;
        return [res,new Point(Xclicked,Yclicked)];
    };
};
