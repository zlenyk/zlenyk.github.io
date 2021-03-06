var Timer = function(){
	var startTime;
	var currentTime;
	var stop = false;
	var me = this;

	this.initTimer = function(){
		document.getElementById('timer').innerHTML = '0';
	}
	
	this.startTimer = function(){
		this.start = new Date().getTime();
		this.stop = false;
		this.timeLoop();
	}

	this.stopTimer = function(){
		this.stop = true;
	}
	this.getTime = function(){
		return this.currentTime;
	}
	this.timeLoop = function(){
		if(this.stop == true) return;
		this.currentTime = new Date().getTime() - this.start;
		this.refreshTimer();
		setTimeout(function(){me.timeLoop();}, 10);
	}
	this.refreshTimer = function(){
		document.getElementById('timer').innerHTML = this.currentTime.toString();
	}
}
