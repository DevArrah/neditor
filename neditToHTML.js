function NeditToHTMLConverter(){
}

NeditToHTMLConverter.prototype.convertNeditMarkup = function( text, article ){
	//console.log( article.textContent.match(/@[a-zA-Z+]+:[^@]+@?/gi) );
	var styleSegmenterPattern = '@([a-zA-Z+]+):([^@]+)@?';
	var styleSegmenterRegex = new RegExp( styleSegmenterPattern, 'gi' );
	var oldStyleSegmenterRegex =/<([0-6])(.*?)>/gi;
	text = text.replace(/<0([\s\S]*?)>/mgi, '@hilite:$1@');
	text = text.replace(/<1([\s\S]*?)>/mgi, '@yellow:$1@');
	text = text.replace(/<2([\s\S]*?)>/mgi, '@red:$1@');
	text = text.replace(/<3([\s\S]*?)>/mgi, '@blue:$1@');
	text = text.replace(/<4([\s\S]*?)>/mgi, '@green:$1@');
	text = text.replace(/<5([\s\S]*?)>/mgi, '@cyan:$1@');
	text = text.replace(/<6([\s\S]*?)>/mgi, '@magenta:$1@');
	
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
	styleSegmenterRegex = new RegExp( styleSegmenterPattern, 'i' );
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
			var textNode = document.createTextNode( lines[j].replace(/ /g,'\xA0'));
			if (textNode.textContent !='') currentParent.appendChild( textNode );
			if ( j != lines.length - 1) currentParent.appendChild( document.createElement('BR') );
		}
		
	}

}