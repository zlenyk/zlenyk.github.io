//window.addEventListener('load', onLoadFun());
window.onload = function(){
	var d_canvas = document.getElementById('dotCanvas');
	drawBoard();
	d_canvas.addEventListener('click',canvasClicked,false);
}
function newGame(){
	for(var i = 0; i<25; i++){
		for(var j = 0; j<25; j++){
			dotArray[i][j] = false;
		}
	}
	drawBoard();
}
function canvasClicked(e){
	var d_canvas = document.getElementById('dotCanvas');
	var x = e.pageX - d_canvas.offsetLeft;
	var y = e.pageY - d_canvas.offsetTop;
	var clickWidth = 3;
	var i = 0;
	while( (((20*i)+10-x)>clickWidth || ((20*i)+10-x)<(-1*(clickWidth))) && i < 25){
		i++;
	}
	var j = 0;
	while( (((20*j)+10-y)>clickWidth || ((20*j)+10-y)<(-1*(clickWidth))) && j < 25){
		j++;
	}
	if(i >= 25 || j >= 25) return;
	
	dotArray[i][j] = true;
	clicked++;
	drawBoard();
	return;
}

function drawBoard(){
	var d_canvas = document.getElementById('dotCanvas');
	var context = d_canvas.getContext('2d');
	context.clearRect(10,10,d_canvas.width,d_canvas.height);
	for(var i = 0; i<25; i++){
		for(var j = 0; j<25;j++){
			if(dotArray[i][j] == false){
				drawCircle(i*20+10,j*20+10,1,context);
			}
			else{
				drawCircle(i*20+10,j*20+10,3,context);
			}
		}
	}
}
function drawCircle(x,y,radius,context){
	context.beginPath();
	context.arc(x, y, radius, 0, 2 * Math.PI, false);
	context.fillStyle = 'black';
	context.fill();
	context.stroke();
}
