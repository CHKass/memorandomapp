export default class Help {
	constructor() {
		this.help = document.querySelector(".format-help")
		this.events()
		//alert("Help is coming")
	}


// 2. Events
	events() {
    	this.help.addEventListener("click", (e) => {
			e.preventDefault()
			this.helpWindow()
			//alert("How to format your text: ")
		})

	}

// Methods
	helpWindow() {
		alert("Some basic formatting is possible for the content area and I have outlined some common features below, but a comprehensive list of Markdown Syntax can be found at daringfireball.net.\r \nTEXT: For *Italic text* put one asterisk before and after the word or words (without a gap). Two asterisks for **bold** text, and three for ***bold and italic***.\r  \nLISTS: Use numerals before each item of an ordered list, with a space after. Unordered lists use an '*', '-' or '+', with a space after. An indent requires '>' on each line.\r \nHEADINGS: For an H1 # Heading use one hash symbol in front (with a gap). H2 use two hash symbols. H3 use three hash symbols, likewise for H4, H5 and H6.\r \nHORIZANTAL RULES: Can be created simply by using at least three hyphens in a row on a line by themselves.\r \nINSERTING AN IMAGE: Requires the following syntax: ![Alt Text](/link_to/image.jpg ''Title''). Inserting a link uses similar syntax but without the exclamation mark.\r")
	}
}