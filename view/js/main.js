// Prevent no console errors
if(!console) {
	console = { 
		log: function() {},
		warn: function() {},
		error: function() {},
		info: function() {}
	};
}

/* --- Global Vars --- */
var pages = new Object();
var scrollOffset = 100;
/* --- End Global Vars --- */

/* --- Global Functions --- */
$(document).ready(function() {
	if(!(pageName in pages)) {
		console.warn("Unable to Load Page Object [" + pageName + "]");
	} else {
		pages[pageName].init();
	}
});

window.onbeforeunload = function() {
	if(!(pageName in pages)) {
		console.warn("Unable to Unload Page Object [" + pageName + "]");
	} else {
		pages[pageName].deinit();
	}
}

function newModal(modal)
{
	if($("#" + modal.name).length > 0)
	{
		$("#" + modal.name).remove();
	}
	
	var modalHTML = "<div id='" + modal.name + "'' class='modal fade' role='dialog'>" + $("#my-empty-modal").html(); + "</div>";
	
	$("#my-modal-container").append(modalHTML);
	$("#" + modal.name + " .modal-title").html(modal.title);
	$("#" + modal.name + " .modal-body").html(modal.body);
	$("#" + modal.name + " .modal-footer").html(modal.footer);
	
	$("#" + modal.name).modal('show');
}
/* --- End Global Function --- */
