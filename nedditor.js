
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
	var converter = new NeditToHTMLConverter();
	converter.convertNeditMarkup( article.textContent, article );
	//var runner = new DOMRunner( article );
	//var converter = new NeditToHTMLConverter( runner );
	//converter.convertNeditMarkup();
}

function useNamedTemplate( templateName ){
	var converter = new NeditToHTMLConverter();
	converter.convertNeditMarkup( necrotemplate[templateName], document.getElementById('rich_with_invoke_element') );
	
}