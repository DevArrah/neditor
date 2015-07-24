function TextRun( domNode, prevRun ){
	//added comment
	this.domNode = domNode;
	this.nextRun = null;
	this.previousRun = prevRun;
	if ( prevRun !== null ) prevRun.nextRun = this;
	if ( domNode.nodeType == 3){
		this.text = domNode.textContent;
	}
	else if (domNode.nodeName == 'BR'){
		this.text = '\n';
	}
}

TextRun.prototype.updateText = function( text ){
	this.text = text;
	this.domNode.textContent = text;	
};

TextRun.prototype.applyBreakAt = function ( index ){
	var preBreakNode = document.createTextNode( this.text.substring(0, index) );
	console.log( 'inserting text' );
	this.insertBefore( preBreakNode );
	console.log( 'inserting text' );
	this.insertBefore( document.createElement('BR') );
	var updateText = this.text.substring( index );
	if (updateText.substring(0,1) == ' ') updateText = '\xA0' + updateText.substring(1);
	this.updateText( updateText );
};

TextRun.prototype.insertBefore = function ( newDomNode ){
	console.debug( this );
	console.debug( newDomNode );
	var newNode = this.domNode.parentNode.insertBefore( newDomNode, this.domNode );
	var newRun = new TextRun( newNode, this.previousRun );
	newRun.nextRun = this;
	this.previousRun = newRun;
	
};

TextRun.prototype.firstRun = function(){
	
	var currentRun = this;
	while ( currentRun.previousRun !== null ){
		currentRun = currentRun.previousRun;
	}
	return currentRun;
};

TextRun.prototype.getIndicesOfRegexMatches = function( text, regex ){
	var result = new Array();
	var match;
	while ( match = regex.exec( text ) ){
		result.push( match.index );
	}
	return result;
}
TextRun.prototype.correctSpacing = function (){
	var punctuationRegex = /[\.\?!]+/gi;
	var nodeText = this.text;
	var result;
	var indices = new Array();
	var matchRuns = nodeText.match( punctuationRegex );
	if ( matchRuns !== null ){
		indices =  this.getIndicesOfRegexMatches( nodeText , punctuationRegex );
		var fullRuns = new Array();
		var startPos = 0;
		
		for (var i = 0; i < indices.length; i++ ){
			fullRuns.push( nodeText.substring(startPos, indices[i] + matchRuns[i].length ) );
			startPos = indices[i] + matchRuns[i].length;
		}
		var lastRun = nodeText.substring( startPos );
		if ( lastRun.trim() !== '' ) fullRuns.push( lastRun );
		 
		
		//console.log( fullRuns )
		//console.log( fullRuns[ fullRuns.length - 1]);
		var newText = fullRuns[0];
		for ( var i = 1; i < fullRuns.length; i++){
			fullRuns[i] = '\xA0\xA0'+fullRuns[i];
			fullRuns[i] = fullRuns[i].replace(/^\s+/, '\xA0\xA0');
			newText += fullRuns[i];
		}
		//figure out the last node
		if ( /[\.\?!]$/.exec( fullRuns[ fullRuns.length - 1 ] ) && this.nextRun !== null && this.nextRun.text != '\n'){
			console.log( 'matched punctuation at end... adding space to next node' );
			var updatedText = ( '\xA0\xA0' + this.nextRun.text ).replace(/^\s+/, '\xA0\xA0');
			this.nextRun.updateText( updatedText );
			
		}
		this.updateText( newText );
	}	
};

TextRun.prototype.findLastSpaceInRun = function( charCount ){

	var result = null;
	if (this.text == '\n' ){
		result = -1;
	}
	else {
		var text =  this.text;
		if ( charCount !== null ) text = text.substring( 0, charCount );
		var matches = this.getIndicesOfRegexMatches( text, /\s/g);
		if ( matches != null && matches.length > 0 ) {
			result = matches[ matches.length - 1]; 
		}	
	}

	return result;
}
TextRun.prototype.applyGutterSpace = function(){
	if ( this.text.substring(0,1) == ' ' ){
		this.updateText( '\xA0' + this.text.substring(1) );
	} else if ( this.text.substring(0,1) !== '\xA0' ){
		this.updateText( '\xA0' + this.text );
	}	
}
//

