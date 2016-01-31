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
    }
    this.drawBoard = function(){
        var context = this.canvas.getContext('2d'); 
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawLines(this.initialLines,1,'black');
        this.drawLines(this.additionalLines,3,'#005100');
        this.drawAllCircles();
    }
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
    }
    this.prepareCirclesArray = function(){
        this.circles = new Array(this.YCoords.length);
        for(var i=0;i<this.XCoords.length;i++){
            this.circles[i] = new Array(this.XCoords.length);
            for(var j=0;j<this.YCoords.length;j++){
                this.circles[i][j] = 0; 
            }
        }
        for(i=0;i<this.initialPoints.length;i++){
            this.circles[this.XCoords.length/2+this.initialPoints[i][0]]
            [this.YCoords.length/2+this.initialPoints[i][1]] = 1;
        }
    }
    this.indexToCoords = function(p){
        return new Point(this.XCoords[p.x],this.YCoords[p.y]);
    }
    this.addLine = function(p1,p2){
        if(this.pointsFormGoodLine(p1,p2)){
            var coordsP1 = this.indexToCoords(p1);
            var coordsP2 = this.indexToCoords(p1);
            var line = new Line(this.indexToCoords(p1),this.indexToCoords(p2));
            if(this.arrayHasLine(this.additionalLines,line) == false){
                this.additionalLines.push(line);
                this.drawBoard();
                return true;
            }
        }
        return false;
    }
    this.pointsFormGoodLine = function(p1,p2){
        var x1 = p1.x;var y1 = p1.y;
        var x2 = p2.x;var y2 = p2.y;
        var xd = x1-x2;
        var yd = y1-y2;
        if(!((Math.abs(xd) == 4 || Math.abs(xd) == 0) &&
                    (Math.abs(yd) == 4 || Math.abs(yd) == 0) &&
                    (xd != 0 || yd != 0))) 
            return false;
        for(var i=1;i<=3;i++){
            if(this.circles[x2+(xd/4)*i][y2+(yd/4)*i] != 1){
                return false;
            }
        }
        return true;
    }
    /*  true if are on same line
     * */
    this.arrayHasLine = function(array,line){
        try{
        for(var i=0;i<array.length;i++){
            if(line.areSame(array[i]) || line.lineOnOther(array[i]))
                return true;
        }
        }catch(err){alert(err);}
        return false;
    }
    /*
     * Just drawing circles from array circles
     */
    this.drawAllCircles = function(){
        for(var i=0;i<this.XCoords.length;i++){
            for(var j=0;j<this.YCoords.length;j++){
                if(this.circles[i][j] == 1)
                    drawCircle(this.canvas,this.XCoords[i],this.YCoords[j],'black');
                else if(this.circles[i][j] == 2){
                    drawCircle(this.canvas,this.XCoords[i],this.YCoords[j],'blue');
                }
            }
        }
    }
    /*
     *  Draw lines from argument array
     */
    this.drawLines = function(linesArray,width,color){
        linesArray.forEach(function(l){
            drawLine(canvas,l,width,color);
        });
    }
    this.drawNewPoint = function(x,y){
        var r = false;
        if(this.circles[x][y] === 0){
            this.circles[x][y] = 1;
            r = true;
            this.drawBoard();
        }
        return r;
    }
    this.erasePoint = function(x,y){
        if(this.circles[x][y] > 0){
            this.circles[x][y] = 0;
            this.drawBoard();
        }
    }
    this.checkPoint = function(x,y){
        var r = false;
        if(this.circles[x][y] > 0){
            if(this.circles[x][y] === 1)
                this.circles[x][y] = 2;
            else if(this.circles[x][y] === 2)
                this.circles[x][y] = 1;
            r = true;
            this.drawBoard();
        }
        return r;
    }
    this.checkedPoints = function(){
        var res = [];
        for(var i=0;i<this.XCoords.length;i++)
            for(var j=0;j<this.YCoords.length;j++)
                if(this.circles[i][j] == 2)
                    res.push(new Point(i,j));
        return res;
    }
    this.flushCheck = function(){
        for(var i=0;i<this.XCoords.length;i++)
            for(var j=0;j<this.YCoords.length;j++)
                if(this.circles[i][j] == 2){
                    this.circles[i][j] = 1;
                }
        this.drawBoard();
    }
    /* returns intersection that near coordinates(argument)
     */
    this.checkLineClicked = function(x,y){
        var mistake = 5;
        var Xclicked = -1;
        var Yclicked = -1;
        for(var i=0;i<this.XCoords.length;i++){
            if(Math.abs(this.XCoords[i]-x) <= mistake){
                Xclicked = i;
                break;
            }
        }
        for(i=0;i<this.YCoords.length;i++){
            if(Math.abs(this.YCoords[i]-y) <= mistake){
                Yclicked = i;
                break;
            }
        }
        return [Xclicked,Yclicked];
    }
}
