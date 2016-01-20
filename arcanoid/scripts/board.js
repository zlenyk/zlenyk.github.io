function Board(_width,_height){
    this.width = _width;
    this.height = _height;
    this.objectsArray = [];
    this.div;
    this.canvas
    this.drawBoard = function(){
        this.div = document.createElement("div");
        this.div.style.width = this.width + 'px';
        this.div.style.height = this.height + 'px';
        this.div.style.border = "2px solid black";
        document.body.appendChild(this.div);

        div.appendChild(canvas);
    }
    this.redrawAll = function(){
        for(var i=0,tot=this.objectsArray.length;i<tot;i++){
            objectsArray[i].draw(this);
        }
    }
    this.redrawOne = function(index){
        objectsArra[index].draw(this);
    }
}

