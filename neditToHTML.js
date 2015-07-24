function NeditToHTMLConverter( runner ){
	this.firstRun = runner.firstRun;
}

NeditToHTMLConverter.prototype.convertNeditMarkup = function(  ){
	var currentRun = this.firstRun;
	var currentParent = this.firstRun.domNode.parentNode;
	
	while (currentRun != null){
		var nextRun = currentRun.nextRun;
		var text = currentRun.text;
		if ( text.indexOf('@') > -1 ){
			var punctuationRegex = /@[a-zA-Z+]+:[^@]+@?/gi
			var matches = text.match( punctuationRegex );
			var indices = new Array();
			if ( matches !=  null && matches.length != 0 ){		
				var match;
				while ( match = punctuationRegex.exec( text ) ){
					indices.push( match.index );
				}
				var segment = new Array();
				var currentRunIndex = 0;
				for ( var i = 0; i < matches.length; i++ ){
					if (currentRunIndex < indices[i]){
						segment.push( text.substring( currentRunIndex, indices[i]) );
					}
					segment.push( matches[i] );
					currentRunIndex = indices[i] + matches[i].length ;
				}
				if (currentRunIndex < text.length) segment.push( text.substr( currentRunIndex ) );
				console.log( segment );
				currentRun = null;
			} else {
				
			}
			
		}
		currentRun = nextRun;
	}
}
