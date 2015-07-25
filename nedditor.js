
function checkFormatting( medium ){
	var article = document.getElementById('rich_with_invoke_element');
	article.normalize(); 
	var charCountForLine = 0;
	console.log( 'beginning check' );
	var runner = new DOMRunner( article );
	var formatter = new TextRunFormattingMediator( runner );
	formatter.applySpacingAfterPunctuation();
	formatter.hardWrapRunsAt( breakAtChar );
	formatter.applyGutter();
	medium.makeUndoable();
}


function generateMarkup(){
	var article = document.getElementById('rich_with_invoke_element');
	var result = document.getElementById('results');
	var runner = new DOMRunner( article );
	var formatter = new TextRunFormattingMediator( runner );
	while (result.firstChild) {
		result.removeChild(result.firstChild);
	}
	formatter.generateMarkUpAlt( article, result );
	selectText('results');
}

function selectText(containerid) {
	if (document.selection) {
		var range = document.body.createTextRange();
		range.moveToElementText(document.getElementById(containerid));
		range.select();
	} else if (window.getSelection) {
		var range = document.createRange();
		range.selectNode(document.getElementById(containerid));
		window.getSelection().addRange(range);
	}
}

function convertNedit2ToHTML(){
	var article = document.getElementById('rich_with_invoke_element');
	article.normalize();
	//var runner = new DOMRunner( article );
	//var converter = new NeditToHTMLConverter( runner );
	//converter.convertNeditMarkup();
	console.log( article.textContent.match(/@[a-zA-Z+]+:[^@]+@?/gi) );
	var styleSegmenterRegex = /@([a-zA-Z+]+):([^@]+)@?/gi;
	var text = article.textContent;
	var matches = text.match( styleSegmenterRegex );
	var indices = new Array();
	var segments = new Array();
	if ( matches !=  null && matches.length != 0 ){		
		var match;
		while ( match = styleSegmenterRegex.exec( text ) ){
			indices.push( match.index );
		}
		var currentRunIndex = 0;
		for ( var i = 0; i < matches.length; i++ ){
			if (currentRunIndex < indices[i]){
				segments.push( text.substring( currentRunIndex, indices[i]) );
			}
			segments.push( matches[i] );
			currentRunIndex = indices[i] + matches[i].length ;
		}
		if (currentRunIndex < text.length) segments.push( text.substr( currentRunIndex ) );		
	} else {
		segments.push(text);
	}
	//now clear the div
	while (article.firstChild) {
		article.removeChild(article.firstChild);
	}
	//rebuild
	for ( var i = 0; i < segments.length; i++){
		var currentParent = article;
		text = segments[i];
		var styleMatch = styleSegmenterRegex.exec(text);
		if( styleMatch != null ){
			var styles = styleMatch[1];
			text = styleMatch[2];
			var individualStyles = styles.split('+');
			for ( var j = 0; j < individualStyles.length; j++){
				var node = document.createElement('SPAN')
				var classAttr = document.createAttribute("class");
				classAttr.value = individualStyles[j];
				node.setAttributeNode(classAttr);
				currentParent.appendChild( node );
				currentParent = node;
			}
			
		}
		var lines = text.split('\n');  
		for (var j = 0; j < lines.length; j++ ){
			var textNode = document.createTextNode( lines[j].replace(' ','\xA0'));
			if (textNode.textContent !='') currentParent.appendChild( textNode );
			if ( j != lines.length - 1) currentParent.appendChild( document.createElement('BR') );
		}
		
	}
	
	
}