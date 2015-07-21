function TextRun( domNode, prevRun ){
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
		indices =  this.getIndicesOfRegexMatches( nodeText , punctuationRegex);
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

function TextRunFormattingMediator ( parentNode ) {
	this.run = this.traverseDOMForTextRuns( parentNode, null).firstRun();
	this.parentNode = parentNode;
	this.currentLineCharCount = 0;
}

TextRunFormattingMediator.prototype.hardWrapRunsAt = function (numOfChars){
	console.log('TextRunFormattingMediator.prototype.hardWrapRunsAt');
	this.currentLineCharCount = 0;
	var currentRun = this.run.firstRun();
	while ( currentRun !== null ){
		var nextRun = currentRun.nextRun;
		//console.log( this.currentLineCharCount );
		//console.log( numOfChars );
		//console.log( currentRun.text.length );
		if ( currentRun.text == '\n' ){
			
			this.currentLineCharCount = 0;
		}
		else if ( this.currentLineCharCount + currentRun.text.length < numOfChars ){
			this.currentLineCharCount += currentRun.text.length;
		}
		else {
			console.log( 'split the node' );
			nextRun = this.calculateWhereToBreak( currentRun, numOfChars - this.currentLineCharCount);
		}
		currentRun = nextRun;
	}
}



TextRunFormattingMediator.prototype.calculateWhereToBreak = function( currentRun, charCount ){
	console.log('TextRunFormattingMediator.prototype.calculateWhereToBreak');
	var originalRun = currentRun;
	var result = this.findSpaceInRun( currentRun, charCount);
	if (  result == null ){
		currentRun = currentRun.previousRun;
		while (result == null && currentRun !== null && currentRun.text != '\n'){
			result = this.findSpaceInRun( currentRun, null );
		}
		if ( result == null ){
			originalRun.applyBreakAt( charCount );
			result = originalRun.previousRun;
		} 	
	}
	console.log( result );
	return result;
}

TextRunFormattingMediator.prototype.findSpaceInRun = function( currentRun, charCount ){
	var result;
	console.log('TextRunFormattingMediator.prototype.findSpaceInRun');
	console.log( charCount );
	var lastSpaceInCurrentRun = currentRun.findLastSpaceInRun( charCount );
	console.log( lastSpaceInCurrentRun );
	if (  lastSpaceInCurrentRun !==null ){
		currentRun.applyBreakAt( lastSpaceInCurrentRun );
		result = currentRun.previousRun;
	}
	return result;
}

TextRunFormattingMediator.prototype.applySpacingAfterPunctuation = function(){
	var currentRun = this.run.firstRun();
	do {
		currentRun.correctSpacing();
		currentRun = currentRun.nextRun;
	} while (currentRun !== null);	
}

TextRunFormattingMediator.prototype.traverseDOMForTextRuns = function( node, currentRun ){
	if ( node.childNodes.length > 0 ){
		for( var i = 0; i < node.childNodes.length; i++){
				currentRun = this.traverseDOMForTextRuns( node.childNodes[i], currentRun );
		}
	} else if (node.nodeType == 3 || node.nodeName == 'BR'){
		currentRun = new TextRun( node, currentRun );
	}
	return currentRun;
}

TextRunFormattingMediator.prototype.applyGutter = function (){
	var currentRun = this.run.firstRun();
	currentRun.applyGutterSpace();
	
	while ( currentRun.nextRun !== null ){
		
		if ( currentRun.domNode.nodeName == 'BR' && currentRun.nextRun.domNode.nodeName !== 'BR' ){
			currentRun.nextRun.applyGutterSpace();
		}
		currentRun = currentRun.nextRun;
	}
}

TextRunFormattingMediator.prototype.generateMarkUpAlt = function( topElement, resultElement ){
	var currentRun = this.run.firstRun();
	while (currentRun != null ){
		if ( currentRun.domNode.nodeName == 'BR'){
			resultElement.appendChild( document.createElement('BR') );
		} else {
			currentRun = this.processContinguousStyleRun( currentRun, resultElement, topElement );
		}
		currentRun = currentRun.nextRun;
	}
}

TextRunFormattingMediator.prototype.getStyleMarkupFor = function( run, topElement ){
	var formatting = { 'color' : '', 'bold' : '', 'underline': '', 'italics':'' };
	var currentElement = run.domNode.parentNode;
	while ( !currentElement.isEqualNode( topElement ) ){
		var className = currentElement.className;
		if ( className !='' ){
			if (formatting.color == '' && ( className == 'hired' || className == 'hiblue' || className == 'higreen' || className == 'hicyan' || className == 'himagenta' || className == 'hiblack' || className == 'brown' || className == 'yellow' || className == 'red' || className == 'blue' || className == 'green' || className == 'cyan' || className == 'magenta' ) ){
				formatting.color = className;
			} else if ( formatting.bold =='' && className == 'hilight'){
				formatting.bold = className;
			} else if ( formatting.underline == '' && className == 'underline' ){
				formatting.underline = className;
			} else if ( formatting.italics == '' && className == 'italics' ){
				formatting.italics = className;
			}
		}
		currentElement = currentElement.parentNode;
	}
	var result = '';
	if ( formatting.color != '' || formatting.bold != '' || formatting.underline != '' || formatting.italics != ''){
			var options = new Array();
			if ( formatting.color != '' ) options.push( formatting.color );
			if ( formatting.bold != '' ) options.push( formatting.bold );
			if ( formatting.underline != '' ) options.push( formatting.underline );
			if ( formatting.italics != '' ) options.push( formatting.italics );
			result = options.join('+');
	}
	return result;	
}


TextRunFormattingMediator.prototype.processContinguousStyleRun = function( run, resultElement, topElement ){
	var currentRun = run;
	var styleRun  = this.getStyleMarkupFor( run, topElement );
	var nodesToAppend = new Array();
	var firstTextNodeIndex = null;
	var lastTextNodeIndex = null;
	var lastRun = null;
	
	while ( currentRun !== null && currentRun.domNode.parentNode == run.domNode.parentNode ){
		lastRun = currentRun;
		if ( currentRun.domNode.nodeName == 'BR'){
			nodesToAppend.push( document.createElement('BR') );
		} else {
			nodesToAppend.push( document.createTextNode( currentRun.text ) );
			lastTextNodeIndex = nodesToAppend.length - 1;
			firstTextNodeIndex = ( firstTextNodeIndex == null ) ? lastTextNodeIndex : firstTextNodeIndex;
		}
		currentRun = currentRun.nextRun;
	}
	if ( styleRun !== ''){
		nodesToAppend[ firstTextNodeIndex ].textContent = '@' + styleRun + ':' + nodesToAppend[ firstTextNodeIndex ].textContent;
		nodesToAppend[ lastTextNodeIndex ].textContent += '@';		
	}
	for ( var i  = 0; i < nodesToAppend.length; i++){
		resultElement.appendChild( nodesToAppend[ i ]);
	}
	return lastRun;
	
}

