window.onload = function(){
	alert('e');
	var d_canvas = document.getElementById('dotCanvas');
	drawBoard();
	d_canvas.addEventListener('click',canvasClicked,false);
}
function newGame(){
	endGame = true;
	for(var i = 0; i<size; i++){
		for(var j = 0; j<size; j++){
			dotArray[i][j] = false;
		}
	}
	drawBoard();
	s = 0;
	ms = 0;
	refreshClock();
}
function canvasClicked(e){
	endGame = false;
	var d_canvas = document.getElementById('dotCanvas');
	var x = e.pageX - d_canvas.offsetLeft;
	var y = e.pageY - d_canvas.offsetTop;
	var c = d_canvas.width/size;
	
	var i = 0;
	while( (((c*i)+c/2-x)>clickWidth || ((c*i)+c/2-x)<(-1*(clickWidth))) && i <size){
		i++;
	}
	var j = 0;
	while( (((c*j)+c/2-y)>clickWidth || ((c*j)+c/2-y)<(-1*(clickWidth))) && j<size){
		j++;
	}
	if(i >= size || j >= size) return;
	
	dotArray[i][j] = true;
	clicked++;
	drawBoard();
	return;
}
function countTime(){
	if(clicked == size*size || endGame) return;
	ms += 2;
	if(ms == 1000){
		s++;
		ms = 0;
	}
	refreshClock();
	setTimeout('countTime()',1);
}
function refreshClock(){
	var text = s.toString() + "." + ms.toString();
	document.getElementById('timer').innerHTML = text;
}

function drawBoard(){
	var d_canvas = document.getElementById('dotCanvas');
	var context = d_canvas.getContext('2d');
	context.clearRect(10,10,d_canvas.width,d_canvas.height);
	var c = d_canvas.width/size;
	clicked = 0;
	for(var i = 0; i<size; i++){
		for(var j = 0; j<size;j++){
			if(dotArray[i][j] == false){
				drawCircle(i*c+c/2,j*c+c/2,smallDot,context);
			}
			else{
				clicked++;
				drawCircle(i*c+c/2,j*c+c/2,bigDot,context);
			}
		}
	}
	if(clicked == 1) countTime();
}
function drawCircle(x,y,r,context){
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI, false);
	context.fillStyle = 'black';
	context.fill();
	context.stroke();

}
