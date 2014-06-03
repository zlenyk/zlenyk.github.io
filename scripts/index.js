window.onload = function(){
	prepareNewGame();
}

function prepareNewGame(){
	
	timer = new Timer();
	board = new Board();
	board.prepareNewBoard();
	timer.initTimer();
}
function startNewGame(){
	timer.stopTimer();
	board.destroyBoard();
	prepareNewGame();
}
function click(){
	var count = board.getClickedCount();
	if(count == 1){
		timer.startTimer();
	}
	if(count == size*size){
		timer.stopTimer();
	}
}
