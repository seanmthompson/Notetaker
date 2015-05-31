// main constructor
function NotesManager() {
	this.notes = [];
};



// load initial data
NotesManager.prototype.loadData = function() {
	if(localStorage && localStorage.getItem('Notes')){
		var notes = JSON.parse(localStorage["Notes"]);
		for (var i = 0; i < notes.length; i++) {
			this.notes.push(notes[i]);
		}
	}
};



//Add current note in text box
NotesManager.prototype.addCurrentNote = function() {
	var current_note = this.$note.val();
	
	if(current_note) {
		this.notes.push(current_note);
		
		if(localStorage) {
			localStorage["Notes"] = JSON.stringify(this.notes);
		}
		
		this.addNote(current_note);
		this.$note.val("");
	}
}


// add note handler
NotesManager.prototype.handleAddNote = function() {
	this.addCurrentNote();	
};


NotesManager.prototype.handleKeyPress = function(evt) {
	if(evt.which == 13) {
		this.addCurrentNote();
	}
};


//append note divs for data
NotesManager.prototype.addNote = function(note) {
	this.$notes.prepend(
		$("<div><p></p></div>")
		.addClass("note")
		.text(note)
	)	
};

NotesManager.prototype.handleNoteClick = function(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	
	this.$notes.addClass("active");
	this.$notes.children(".note").removeClass("highlighted");
	$(evt.target).addClass("highlighted");
};


NotesManager.prototype.handleDocumentClick = function() {
	this.$notes.removeClass("active");
	this.$notes.children(".note").removeClass("highlighted");	
};


NotesManager.prototype.handleSearch = function(evt) {
	evt.preventDefault();
	evt.stopPropagation();
	
	var that = this;
	
	var search_term = this.$search.val();
		
	if(search_term) {
		that.$notes.empty();
		var filtered = this.notes.filter(function(item) {
			var found = item.indexOf(search_term);
			return found >= 0;
		});
		
		for(var i = 0; i< filtered.length; i++) {
			that.addNote(filtered[i]);
		}
		
	} else {
		that.$notes.empty();
		for(var i = this.notes.length -1; i >= 0; i--) {
			this.addNote(this.notes[i]);
		}
	}
}

// main init function
// takes options of: 
// help div id, help button id, note button id, note input id, notes id
NotesManager.prototype.init = function(opts) {
	this.$notes = $(opts.notes);
	this.$note = $(opts.note);
	this.$open_help = $(opts.open_help);
	this.$add_note  = $(opts.add_note);
	this.$search = $(opts.search);
	this.$search_submit = $(opts.search_submit);
	
	//create initial notes from init data (and we start from the end as we're prepending
	for(var i = this.notes.length -1; i >= 0; i--) {
		this.addNote(this.notes[i]);
	}
	
	this.$add_note.bind("click", this.handleAddNote.bind(this));
	$(document).bind("keypress", this.handleKeyPress.bind(this));
	
	// listen for clicks on note elements
	this.$notes.on("click",".note",this.handleNoteClick.bind(this));
	
	//listen for document clicks outside of notes div 
	$(document).bind("click", this.handleDocumentClick.bind(this));
	
	this.$search_submit.bind("click", this.handleSearch.bind(this));
	
};


var notes = new NotesManager();

notes.loadData();

notes.init({
	notes: '#notes',
	note: '#note',
	add_note: '#add_note',
	search: '#search',
	search_submit: '#search_submit'
})