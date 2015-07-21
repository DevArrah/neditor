# neditor
A browser-based wysiwyg rich text editor that can translate those styles to nedit mark up. 

# Using Neditor
No installation is required... Just download [The neditor](https://github.com/DevArrah/neditor/archive/master.zip) to you desktop, unzip the file, and double click on the index.html file. This will open it up in your favorite browser.

Then enter some text and apply some styles. 

When you are done styling your text, you click on **Apply Formatting**.

The **Apply Formatting** button does 3 things:
1. Ensures there are 2 spaces after every punctuation mark (i.e. !, ?, or .))
2. Splits lines on whole words to ensure lines are of the correct length
3. Ensures that each line starts with at least 1 spaces

Once you are satisfied with your edits, you can click on the **Generate Markup** button which will translate your text into nedit markup. The **Nedit Markup** area is all ready selected so you can jump directly to 

# Some Cool Features but unobvious features:

* it supports mutliple undo (ctrl-z) and redo (ctrl-shift-z)
* you can configure all the colors to your liking by modifying the necro-colors.js file. This uses the same attributes as css  but as name values pairs. So width: 25px; would be 'width' : '25px'. Notice the single quotes around width and 25px. Look more at the JSS library if this is confusing. 
	
The neditor makes use of the following open source libraries and their dependencies:

* JSS ( [https://github.com/Box9/jss](https://github.com/Box9/jss) )
* Pure Buttons ( [http://purecss.io/buttons/](http://purecss.io/buttons/) )
* Medium.js ( [http://jakiestfu.github.io/Medium.js/docs/](http://jakiestfu.github.io/Medium.js/docs/) )
