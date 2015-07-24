function NeditToHTMLConverter(){}

NeditToHTMLConverter.prototype.convertChildParentNodes = function( article ){

	
}

NeditToHTMLConverter.prototype.traverseDOMForTextRuns = function( node, currentStyle ){
	if ( node.childNodes.length > 0 ){
		for( var i = 0; i < node.childNodes.length; i++){
				currentStyle = this.traverseDOMForTextRuns( node.childNodes[i], currentRun );
		}
	} else if (node.nodeType == 3 || node.nodeName == 'BR'){
		currentStyle = this.processTextNodeForStyles( node, currentStyle );
	}
	return currentStyle;
}

NeditToHTMLConverter.prototype.processTextNodeForStyles = function( node, currentStyle ){
	
	if ( node.textContent.indexOf('@')> -1 ){
		
	}
}