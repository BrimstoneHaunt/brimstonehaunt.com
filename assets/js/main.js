/* ----------------------------------------------------
  |                                                    |
  |	GLOBALS                                            |
  |                                                    |
   ---------------------------------------------------- */
   
var scrollOffset = 100;
var homePageBanner = null;
var countdown = {
	openingDate: new Date("Sep 27, 2019 19:00:00").getTime(),
	timer: null,
	update: function() {
		var now = new Date().getTime();
		var distance = countdown.openingDate - now;
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		
		$("#countdown-timer #count-days").html(days);
		$("#countdown-timer #count-hours").html(hours);
		$("#countdown-timer #count-minutes").html(minutes);
		$("#countdown-timer #count-seconds").html(seconds);
	},
	start: function() {
		countdown.timer = setInterval(countdown.update, 1000);
	},
	stop: function() {
		clearInterval(countdown.timer);
	}
};

/* ----------------------------------------------------
  |                                                    |
  |	FUNCTIONS                                          |
  |                                                    |
   ---------------------------------------------------- */

function scrollPageTo(section) {
	if($('#main-nav .navbar-collapse').attr('aria-expanded'))
	{
		$('#main-nav-menu').collapse('hide');
		setTimeout(function() {
			$('html, body').animate({
		        scrollTop: $(section).offset().top - scrollOffset
		    }, 250);
		}, 500);
	}
	else
	{
		$('html, body').animate({
	        scrollTop: $(section).offset().top - scrollOffset
	    }, 750);
	}
}

function startTimeClockNow() {
	$.post("/timeclock/clockin", {  }, function(resp) {
		var newContent = $(resp).filter("#timeclock-page").html();
		$("#timeclock-page").html(newContent);
		initTimeClockPage();
	}).fail(function() {
		alert("Something went wrong!");
	});
	
	return false;
}

function stopTimeClockNow() {
	$.post("/timeclock/clockout", {  }, function(resp) {
		var newContent = $(resp).filter("#timeclock-page").html();
		$("#timeclock-page").html(newContent);
		initTimeClockPage();
	}).fail(function() {
		alert("Something went wrong!");
	});
	
	return false;
}

function clockout(user) {
    $.post("/timeclock/clockout/user", { user: user }, function(resp) {
        var newContent = $(resp).filter("#clockedin-page").html();
        $("#clockedin-page").html(newContent);
    }).fail(function() {
        alert("Something went wrong!");
    });
    
    return false;
}

function clockoutAll() {
    $.post("/timeclock/clockout/all", {  }, function(resp) {
        var newContent = $(resp).filter("#clockedin-page").html();
        $("#clockedin-page").html(newContent);
    }).fail(function() {
        alert("Something went wrong!");
    });
    
    return false;
}

function openTimeClockModal(that, type) {
	if(that) {
		$("#timeclock-modal").data("entryid", $(that).data("entryid"));
		$("#timeclock-modal .start-time-input").val($(that).data("starttime"));
		$("#timeclock-modal .end-time-input").val($(that).data("endtime"));
		$("#timeclock-modal .comments-input").val($(that).data("comments"));
	} else if(type == "stop") {
		$("#timeclock-modal").data("entryid", $("#timeclock-page .entry-row").first().find(".edit-btn").data("entryid"));
		$("#timeclock-modal .start-time-input").val($("#timeclock-page .entry-row").first().find(".edit-btn").data("starttime"));
		$("#timeclock-modal .comments-input").val($("#timeclock-page .entry-row").first().find(".edit-btn").data("comments"));
	} else if(type == "start") {
		$("#timeclock-modal").data("entryid", "NEW");
	}
	
	$("#timeclock-modal").modal();
}

function updateTimeEntry() {
	var id = $("#timeclock-modal").data("entryid");
	var startTime = $("#timeclock-modal .start-time-input").val();
	var endTime = $("#timeclock-modal .end-time-input").val();
	var comments = $("#timeclock-modal .comments-input").val();
	var url = "";
	
	$("#timeclock-modal").modal('hide');
	
	if(id == "NEW") {
		url = "/timeclock/clockin";
	} else {
		url = "/timeclock/update";
	}
	
	$.post(url, { id: id, startTime: startTime, endTime: endTime, comments: comments }, function(resp) {
		var newContent = $(resp).filter("#timeclock-page").html();
		$("#timeclock-page").html(newContent);
		initTimeClockPage();
	}).fail(function() {
		alert("Something went wrong!");
	});
	
	return false;
}

function deleteTimeEntry() {	
	if(confirm("Are you sure you wish to delete this time clock entry?")) {
		var id = $("#timeclock-modal").data("entryid");
		
		$("#timeclock-modal").modal('hide');
	
		$.post("/timeclock/delete", { id: id }, function(resp) {
			var newContent = $(resp).filter("#timeclock-page").html();
			$("#timeclock-page").html(newContent);
			initTimeClockPage();
		}).fail(function() {
			alert("Something went wrong!");
		});
	}
	
	return false;
}

function openAdminAppModal(userID) {	
	$("#admin-app-modal .modal-body").html("");
	
	$.post("/user/app", { id: userID }, function(resp) {
		var newContent = $(resp).find("#app-list").html();
		$("#admin-app-modal .modal-body").html(newContent);
	}).fail(function() {
		alert("Something went wrong!");
	});
	
	$("#admin-app-modal").modal();
}

function openTimeSheet(userID) {    
    $("#time-sheet-modal .modal-body").html("");
    
    $.post("/timeclock/user", { id: userID }, function(resp) {
        var newContent = $(resp).filter("#time-sheet-page").html();
        $("#time-sheet-modal .modal-body").html(newContent);
    }).fail(function() {
        alert("Something went wrong!");
    });
    
    $("#time-sheet-modal").modal();
}

function openAdminAccountModal(userID) {
	$("#admin-account-modal input[name='firstName']").val($("#" + userID + "-first").val());
	$("#admin-account-modal input[name='middleName']").val($("#" + userID + "-middle").val());
	$("#admin-account-modal input[name='lastName']").val($("#" + userID + "-last").val());
	$("#admin-account-modal input[name='email']").val($("#" + userID + "-email").val());
	$("#admin-account-modal select[name='accessLvl']").val($("#" + userID + "-accessLvl").val());
	$("#admin-account-modal input[name='payrate']").val($("#" + userID + "-payrate").val());
	
	$("#admin-account-modal").data("userid", userID);
	
	$("#admin-account-modal").modal();
}

function adminUpdateAccount() {
	var id = $("#admin-account-modal").data("userid");
	var first = $("#admin-account-modal input[name='firstName']").val();
	var middle = $("#admin-account-modal input[name='middleName']").val();
	var last = $("#admin-account-modal input[name='lastName']").val();
	var email = $("#admin-account-modal input[name='email']").val();
	var accessLvl = $("#admin-account-modal select[name='accessLvl']").val();
	var payrate = $("#admin-account-modal input[name='payrate']").val();
	
	$("#admin-account-modal").modal('hide');
	
	$.post("/user/adminupdate", { id: id, first: first, middle: middle, last: last, email: email, accessLvl: accessLvl, payrate: payrate }, function(resp) {
		var newContent = $(resp).filter("#accountlist-page").html();
		$("#accountlist-page").html(newContent);
	}).fail(function() {
		alert("Something went wrong!");
	});
	
	return false;
}

function adminResetPassword() {
	if(confirm("Are you sure you want to reset this users password?")) {
		var id = $("#admin-account-modal").data("userid");
		
		$.post("/user/adminresetpassword", { userid: id }, function(resp) {
			if(resp.success) {
				$("#admin-account-modal").modal('hide');
			}
			
			alert(resp.message);
		}).fail(function() {
			alert("Something went wrong!");
		});
	}
	
	return false;
}

function adminDeleteAccount() {
	if(confirm("Are you sure you want to delete this users account?")) {
		var id = $("#admin-account-modal").data("userid");
		
		$("#admin-account-modal").modal('hide');
		
		$.post("/user/admindeleteaccount", { id: id }, function(resp) {
			var newContent = $(resp).filter("#accountlist-page").html();
			$("#accountlist-page").html(newContent);
		}).fail(function() {
			alert("Something went wrong!");
		});
	}
	
	return false;
}

function preSubmitApplication() {
	if($("#application-form").valid()) {
		if(confirm("Are you sure you're ready to submit this application? You will not be able to make any further changes or submit another application once this one is submitted.")) {
			$("#submit-application-btn").prop('disabled', true);
			return true;
		}
	}
	
	return false;
}

function applicationHire(appID, appListType) {
	if(confirm("Are you sure you want to hire this applicant? This will create them an account in the system, assign them a payrate, and grant them access to the time clock.")) {
		$.post("/application/hire", { id: appID, appListType: appListType }, function(resp) {
			var newContent = $(resp).filter("#applicationlist-page").html();
			$("#applicationlist-page").html(newContent);
		}).fail(function() {
			alert("Something went wrong!");
		});
	}
}

function applicationHold(appID, appListType) {
	$.post("/application/hold", { id: appID, appListType: appListType }, function(resp) {
		var newContent = $(resp).filter("#applicationlist-page").html();
		$("#applicationlist-page").html(newContent);
	}).fail(function() {
		alert("Something went wrong!");
	});
}

function applicationReject(appID, appListType) {
	$.post("/application/reject", { id: appID, appListType: appListType }, function(resp) {
		var newContent = $(resp).filter("#applicationlist-page").html();
		$("#applicationlist-page").html(newContent);
	}).fail(function() {
		alert("Something went wrong!");
	});
}

/* ----------------------------------------------------
  |                                                    |
  |	INIT                                               |
  |                                                    |
   ---------------------------------------------------- */
   
function initTimeClockPage() {
	$("#timeclock-page .entry-row").each(function() {
		if($(this).find(".end-time span").html() == "") {
			$(this).addClass("on-the-clock");
		}
	});
}

$(document).ready(function() {
	if($(".swiper-container").length > 0) {
		homePageBanner = new Swiper('.swiper-container', {
			direction: 'horizontal',
			loop: true,
			pagination: {
				el: '.swiper-pagination',
				hideOnClick: false,
				clickable: true
			},
			autoHeight: true,
			autoplay: {
				delay: 5000
			},
			grabCursor: true,
			effect: 'slide',
			spaceBetween: 25,
		});
		homePageBanner.update();
	}
	
	if($("#countdown-timer").length > 0) {
		countdown.start();
	}
	
	if($("#timeclock-page").length > 0) {
		initTimeClockPage();
	}
	
	if($("#application-form").length > 0) {
		$("#application-form").validate({
			onfocusout: function(element) {
			    if (!this.checkable(element)) {
			        this.element(element);
			    }
			},
			rules: {
				phone: {
      				phoneUS: true
				},
				zip: {
					zipcodeUS: true
				}
			}
		});
	}
}).on("submit", "#giveaway-form", function() {
	if($("input[name=code]").val() != "FREETIX18HH") {
		alert("Invalid Code! The correct code for this giveaway can be found on our Facebook post.");
		return false;
	}
}).on("click", "#app-list .list-group-item-action, #time-clock-user-list .list-group-item-action", function() {
	$($(this).data("target")).slideToggle();
	$(this).toggleClass("active");
}).on("click", ".application-action", function(e) {
	e.stopPropagation();
	
	if($(this).data("action") == "hire") {
		applicationHire($(this).data("appid"), $(this).data("applisttype"));
	} else if($(this).data("action") == "hold") {
		applicationHold($(this).data("appid"), $(this).data("applisttype"));
	} else if($(this).data("action") == "reject") {
		applicationReject($(this).data("appid"), $(this).data("applisttype"));
	}
}).on("change", "#time-sheet-page input[name='startExport'], #time-sheet-page input[name='endExport']", function() {
	$("#time-sheet-data").html("");
	if($("#time-sheet-page input[name='startExport']").val() != "" && $("#time-sheet-page input[name='endExport']").val() != "") {
		$.post("/timeclock/view", { start: $("#time-sheet-page input[name='startExport']").val(), end: $("#time-sheet-page input[name='endExport']").val() }, function(resp) {
			var newContent = $(resp).filter("#time-sheet-data").html();
			$("#time-sheet-data").html(newContent);
		}).fail(function() {
			alert("Something went wrong!");
		});
	}
});
