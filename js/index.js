//window.addEventListener('load', onLoadFun());
window.onload = function(){
	createTable(20);
	var dots = window.document.getElementsByClassName('dot');
	for(var i = 0; i<dots.length; i++){
		dots[i].addEventListener('click',function(e){
			counter++;	
			this.src = 'images/Dot.png';
		});
	}

	var counterDiv = window.document.getElementById('counterDiv');
	
}
function createTable(number){
	var table = window.document.getElementById('dotTable');
	for(var i = 0; i<number; i++){
		var row = table.insertRow(0);
		for(var j = 0; j<number; j++){
			var col = row.insertCell(0);
			
			col.appendChild(createDotImage());
		}
	}
}
function createDotImage(){
	var image = window.document.createElement('img');
	image.src = 'images/smallDot.png';
	image.className = 'dot';
	return image;
}
function newGame(){
	var dots = window.document.getElementsByClassName('dot');
	for(var i = 0; i<dots.length; i++){
		dots[i].src = 'images/smallDot.png';
	}
	alert(counter.toString());
	counter = 0;
}
