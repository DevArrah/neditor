function TextRunFormattingMediator ( domRunner ) {
	this.run = domRunner.firstRun; 
	this.parentNode = domRunner.parentNode;
	this.currentLineCharCount = 0;
}

TextRunFormattingMediator.prototype.hardWrapRunsAt = function (numOfChars){
	//console.log('TextRunFormattingMediator.prototype.hardWrapRunsAt');
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
			//console.log( 'split the node' );
			nextRun = this.calculateWhereToBreak( currentRun, numOfChars - this.currentLineCharCount);
		}
		currentRun = nextRun;
	}
}



TextRunFormattingMediator.prototype.calculateWhereToBreak = function( currentRun, charCount ){
	//console.log('TextRunFormattingMediator.prototype.calculateWhereToBreak');
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
	//console.log( result );
	return result;
}

TextRunFormattingMediator.prototype.findSpaceInRun = function( currentRun, charCount ){
	var result;
	//console.log('TextRunFormattingMediator.prototype.findSpaceInRun');
	//console.log( charCount );
	var lastSpaceInCurrentRun = currentRun.findLastSpaceInRun( charCount );
	//console.log( lastSpaceInCurrentRun );
	//var debug = currentRun.text.length;
	if (lastSpaceInCurrentRun == 0 && currentRun.text.length == charCount + 1){
		//if the space is the first character and the run is max run +1, this is result of applying the gutter space so we let it slide. 
		result = currentRun.nextRun;
	}
	else if ( lastSpaceInCurrentRun !==null ){
		currentRun.applyBreakAt( lastSpaceInCurrentRun == 0 ? charCount :  lastSpaceInCurrentRun );
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
			} else if ( formatting.bold =='' && className == 'hilite'){
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

