jss.set( '#rich_with_invoke_element.editorfont', editorFont );
jss.set( '#rich_with_invoke_element.defaultfg', defaultFontColor );
jss.set( '#rich_with_invoke_element.defaultbg', textBGColor );
jss.set( '#results.editorfont', editorFont );
jss.set( '#results.defaultfg', defaultFontColor );
jss.set( '#results.defaultbg', textBGColor );
jss.set( 'body.background', windowBGColor );
jss.set( '.hired', hired );
jss.set( 'button.hired.pure-button', hired );
jss.set( '.hiblue', hiblue );
jss.set( 'button.hiblue.pure-button', hiblue );
jss.set( '.higreen', higreen );
jss.set( 'button.higreen.pure-button', higreen );
jss.set( '.hicyan', hicyan );
jss.set( 'button.hicyan.pure-button', hicyan );
jss.set( '.himagenta', himagenta );
jss.set( 'button.himagenta.pure-button', himagenta );
jss.set( '.hilite', hilight );
jss.set( 'button.hilite.pure-button', hilight );
jss.set( '.brown', brown );
jss.set( 'button.brown.pure-button', brown );
jss.set( '.yellow', yellow );
jss.set( 'button.yellow.pure-button', yellow );
jss.set( '.red', red );
jss.set( 'button.red.pure-button', red );
jss.set( '.blue', blue );
jss.set( 'button.blue.pure-button', blue );
jss.set( '.green', green );
jss.set( 'button.green.pure-button', green );
jss.set( '.cyan', cyan );
jss.set( 'button.cyan.pure-button', cyan );
jss.set( '.magenta', magenta );
jss.set( 'button.magenta.pure-button', magenta );
jss.set( '.hiblack', hiblack );
jss.set( 'button.hiblack.pure-button', hiblack );
jss.set( '.italics', italics );
jss.set( 'button.italics.pure-button', italics );
jss.set( '.underline', underline );
jss.set( 'button.underline.pure-button', underline );


function calculateStyle( selector ){
	var styleTable = jss.get( selector );
	var result = '';
	//console.log( 'elements for ' + selector );
	for ( index in styleTable ){
		console.log( index );
		result += index + ': ' + styleTable[ index ] + ';';
	}
	//console.log( 'the calculated style string is: ' + result );
	return result;
}
