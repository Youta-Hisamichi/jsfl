/**
 * This jsfl is avoid 15sec freeze limit on the jsfl specification.
 * @author youta.hisamichi@gmail.com
 */

var EXE_END_TIME = 30; // sec. plz change
var startTime = +new Date();
var progressTime = startTime;
var totalElapsedTime = 0;

init();

function exe(){
	//== plz write loop exe process ==
}

function init(){
	EXE_END_TIME *= 1000;
	executeLoop();
	alert("Finished. congratulations! time = " + totalElapsedTime / 1000);
}

function executeLoop(){
	while(true){
		
		exe();
		
		avoidFreeze();
		var isFinished = EXE_END_TIME < totalElapsedTime;
		if(isFinished){
			break;
		}	
	}
}

function avoidFreeze(){
	var now = +new Date();
	var elapsedTime = now - progressTime;
	totalElapsedTime = now - startTime;
	
	if(elapsedTime > 10000){ // less than 15 sec
		progressTime = now;
		//avoid freeze process
		fl.createDocument();
		fl.getDocumentDOM().publish();
		fl.getDocumentDOM().close();
	}
}
