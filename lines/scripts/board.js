var Board = function(){
	var clicked = 0;
	var me = this;

	var game_el = document.querySelector('#game');
	game_el.style.height = gameHeight;
	game_el.style.width = gameWidth;
	
	var stage = null;

	this.prepareNewBoard = function(){
		this.stage = new Kinetic.Stage({
			container:game_el,
			width:gameWidth,
			height:gameHeight
		});
		this.clicked = 0;

		this.drawBoard();
	}
	this.drawBoard = function(){
		var layer = new Kinetic.Layer();
		var c = gameWidth/size;
		for(var i = 0; i < size; i++){
			for(var j = 0; j<size; j++){
				layer.add(this.drawCircle(layer,i*c+c/2 , j*c+c/2 ,dotSize));
			}
		}
                layear.add(this.drawLine(layer));
		this.stage.add(layer);
	}
        this.drawLine = function(layer){
            var line = new Kinetic.Line({
                points: [20,15,10,10],
                stroke: 'black',
                tension: 1
            });
            return line;
        }

	this.drawCircle = function(layer,_x,_y,r){

		var circle = new Kinetic.Circle({
			radius: r,
			fill: 'black',
			x: _x,
			y: _y
		});
		circle.on('click',function(){
			me.circleClicked(circle);
			circle.radius(bigDotSize);
			layer.draw();
		});
		return circle;
	}
	this.circleClicked = function(circle){	
		if(circle.radius() != bigDotSize){
			this.clicked++;
		}
		click();						//function in game that controls timer
	}
	this.getClickedCount = function(){
		return this.clicked;
	}
	this.destroyBoard = function(){
		this.stage.destroy();
	}
}
