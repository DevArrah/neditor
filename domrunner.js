function DOMRunner( parentNode ){
	this.parentNode = parentNode;
	this.firstRun = this.traverseDOMForTextRuns( parentNode, null).firstRun();
}

DOMRunner.prototype.traverseDOMForTextRuns = function( node, currentRun ){
	if ( node.childNodes.length > 0 ){
		for( var i = 0; i < node.childNodes.length; i++){
				currentRun = this.traverseDOMForTextRuns( node.childNodes[i], currentRun );
		}
	} else if (node.nodeType == 3 || node.nodeName == 'BR'){
		currentRun = new TextRun( node, currentRun );
	}
	return currentRun;
}