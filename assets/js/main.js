/* ----------------------------------------------------
  |                                                    |
  |	GLOBALS                                            |
  |                                                    |
   ---------------------------------------------------- */
   
var scrollOffset = 100;
var homePageBanner = null;
var countdown = {
	openingDate: new Date("Sep 25, 2020 19:00:00").getTime(),
	timer: null,
	update: function() {
		var now = new Date().getTime();
		var distance = countdown.openingDate - now;
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		
		if(days < 0) days = 0;
		if(hours < 0) hours = 0;
		if(minutes < 0) minutes = 0;
		if(seconds < 0) seconds = 0;
		
		$("#countdown-timer #count-days").html(days);
		$("#countdown-timer #count-hours").html(hours);
		$("#countdown-timer #count-minutes").html(minutes);
		$("#countdown-timer #count-seconds").html(seconds);
		
		if(days <= 0) {
			$("#countdown-title span").html("Now Open!<br>Friday and Saturday Nights<br>Through October.");
		} else {
			$("#countdown-title span").html("We're sharpening the blades in anticipation");
		}
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
		initRecordLists();
    }).fail(function() {
        alert("Something went wrong!");
    });
    
    return false;
}

function clockoutAll() {
    $.post("/timeclock/clockout/all", {  }, function(resp) {
        var newContent = $(resp).filter("#clockedin-page").html();
		$("#clockedin-page").html(newContent);
		initRecordLists();
    }).fail(function() {
        alert("Something went wrong!");
    });
    
    return false;
}

function openTimeClockModal(that, type) {
	window.timesheetEmployeeID = "";
	if($("#timesheetUser").length > 0) {
		window.timesheetEmployeeID = $("#timesheetUser").val();
	}
	$("#time-sheet-modal").modal("hide");

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
	
	$("#timeclock-modal").modal("show");
}

function updateTimeEntry() {
	var id = $("#timeclock-modal").data("entryid");
	var startTime = $("#timeclock-modal .start-time-input") ? $("#timeclock-modal .start-time-input").val() : null;
	var endTime = $("#timeclock-modal .end-time-input") ? $("#timeclock-modal .end-time-input").val() : null;
	var comments = $("#timeclock-modal .comments-input").val();
	var url = "";

	if(startTime == null && endTime == null) {
		$("#timeclock-modal").modal('hide');

		url = "/timeclock/update/comment";
		
		$.post(url, { id: id, comments: comments }, function(resp) {
			var newContent = $(resp).filter("#timeclock-page").html();
			if($("#timeclock-page").length > 0) {
				$("#timeclock-page").html(newContent);
				initTimeClockPage();
			} else {
				setTimeout(function() { openTimeSheet(window.timesheetEmployeeID); }, 300);
			}
		}).fail(function() {
			alert("Something went wrong!");
		});
	} else {
		var now = Date.now();
		var startTimeDate = new Date(startTime);
		var endTimeDate = endTime ? new Date(endTime) : null;

		if(startTimeDate && ((startTimeDate <= endTimeDate && endTimeDate <= now) || !endTimeDate)) {
			$("#timeclock-modal").modal('hide');
			
			if(id == "NEW") {
				url = "/timeclock/clockin";
			} else {
				url = "/timeclock/update";
			}
			
			$.post(url, { id: id, startTime: startTime, endTime: endTime, comments: comments }, function(resp) {
				var newContent = $(resp).filter("#timeclock-page").html();
				if($("#timeclock-page").length > 0) {
					$("#timeclock-page").html(newContent);
					initTimeClockPage();
				} else {
					setTimeout(function() { openTimeSheet(window.timesheetEmployeeID); }, 300);
				}
			}).fail(function() {
				alert("Something went wrong!");
			});
		} else {
			alert("End time must be after start time and cannot be in the future!");
		}
	}
	
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
	$("#admin-account-modal select[name='position']").val($("#" + userID + "-position").val());
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
	var position = $("#admin-account-modal select[name='position']").val();
	var payrate = $("#admin-account-modal input[name='payrate']").val();
	
	$("#admin-account-modal").modal('hide');
	
	$.post("/user/adminupdate", { id: id, first: first, middle: middle, last: last, email: email, accessLvl: accessLvl, payrate: payrate, position: position }, function(resp) {
		var newContent = $(resp).filter("#accountlist-page").html();
		$("#accountlist-page").html(newContent);
		initRecordLists();
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
	if(confirm("Are you sure you want to deactivate this users account?")) {
		var id = $("#admin-account-modal").data("userid");
		
		$("#admin-account-modal").modal('hide');
		
		$.post("/user/admindeleteaccount", { id: id }, function(resp) {
			var newContent = $(resp).filter("#accountlist-page").html();
			$("#accountlist-page").html(newContent);
			initRecordLists();
		}).fail(function() {
			alert("Something went wrong!");
		});
	}
	
	return false;
}

function adminUndeleteAccount() {
	if(confirm("Are you sure you want to reactivate this users account?")) {
		var id = $("#admin-account-modal").data("userid");
		
		$("#admin-account-modal").modal('hide');
		
		$.post("/user/adminundeleteaccount", { id: id }, function(resp) {
			var newContent = $(resp).filter("#accountlist-page").html();
			$("#accountlist-page").html(newContent);
			initRecordLists();
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
			initRecordLists();
		}).fail(function() {
			alert("Something went wrong!");
		});
	}
}

function applicationHold(appID, appListType) {
	$.post("/application/hold", { id: appID, appListType: appListType }, function(resp) {
		var newContent = $(resp).filter("#applicationlist-page").html();
		$("#applicationlist-page").html(newContent);
		initRecordLists();
	}).fail(function() {
		alert("Something went wrong!");
	});
}

function applicationReject(appID, appListType) {
	$.post("/application/reject", { id: appID, appListType: appListType }, function(resp) {
		var newContent = $(resp).filter("#applicationlist-page").html();
		$("#applicationlist-page").html(newContent);
		initRecordLists();
	}).fail(function() {
		alert("Something went wrong!");
	});
}

function showCreatePosition() {
	$("#createPosition").slideDown();
	return false;
}

function cancelCreatePosition() {
	$("#createPosition").slideUp(100);
	$("#createPositionForm input").val("");
	$("#createPositionForm input[type=checkbox]").prop("checked", false);
	return false;
}

function createPosition() {
	$.post("/positions/create", { title: $("#createPositionForm input[name=title]").val(), defaultPayrate: $("#createPositionForm input[name=defaultPayrate]").val(), canApply: $("#createPositionForm input[name=canApply]").is(":checked") }, function(resp) {
		var newContent = $(resp).filter("#positions-page").html();
		$("#positions-page").html(newContent);
	}).fail(function() {
		alert("Something went wrong!");
	});
	return false;
}

function showEditPosition(id) {
	cancelEditPosition();
	
	$("#position-" + id).fadeOut(function(){
		$("#edit-position-" + id).fadeIn(function() {
			$("[id^='edit-position-']:visible").hide();
			$("[id^='position-']:hidden").show();
			$("#position-" + id).hide();
			$("#edit-position-" + id).show();
		});
	});

	return false;
}

function cancelEditPosition() {
	$("[id^='edit-position-']:visible").fadeOut('fast', function() {
		$("[id^='position-']:hidden").fadeIn('fast');
	});

	$("input[type='text'], input[type='number']").each(function() {
		$(this).val($(this).data('orig-value'));
	});
	$("input[type='checkbox']").each(function() {
		$(this).prop('checked', $(this).data('orig-value') == 'checked');
	});
	
	return false;
}

function deletePosition(id) {
	if(confirm("Are you sure you wish to delete this position?")) {
		$.post("/positions/delete", { id: id }, function(resp) {
			var newContent = $(resp).filter("#positions-page").html();
			$("#positions-page").html(newContent);
		}).fail(function() {
			alert("Something went wrong!");
		});
	}
	return false;
}

function updatePosition(id) {
	$.post("/positions/update", { id: id, title: $("#edit-position-" + id + " input[name=title]").val(), defaultPayrate: $("#edit-position-" + id + " input[name=defaultPayrate]").val(), canApply: $("#edit-position-" + id + " input[name=canApply]").is(":checked") }, function(resp) {
		var newContent = $(resp).filter("#positions-page").html();
		$("#positions-page").html(newContent);
	}).fail(function() {
		alert("Something went wrong!");
	});

	return false;
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

function initRecordLists() {
	if($("[data-header-position-id]").length > 0) {
		var message = "No Records Found!";
		if($("#clockedin-page").length > 0) {
			message = "No Clocked In Employees!";
		} else if($("#accountlist-page").length > 0) {
			message = "No Employees Found!";
		} else if($("#applicationlist-page").length > 0) {
			message = "No Applications Found!";
		}

		$("[data-header-position-id]").each(function() {
			var curPosition = $(this).data("header-position-id");

			if($("[data-item-position-id='" + curPosition + "']").length == 0) {
				$(this).after("<div class='list-group-item'><center>" + message +  "</center></div>");
			}
		});
	}
}

$(document).ready(function() {
	if($(".swiper-container").length > 0) {
		homePageBanner = new Swiper('.swiper-container', {
			direction: 'horizontal',
			loop: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			pagination: {
				el: '.swiper-pagination',
				hideOnClick: false,
				clickable: true
			},
			autoHeight: true,
			autoplay: {
				delay: 15000
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

	initRecordLists();
}).on("scroll", function() {
	if($('#tagline').length > 0 && $('#faq').length > 0) {
		var taglineDistance = $(window).scrollTop() - $('#tagline').offset().top;
		var faqDistance = $(window).scrollTop() - $('#faq').offset().top;
		
		if(taglineDistance >= -150) {
			$('#scythe').addClass('animate');
		} else {
			$('#scythe').removeClass('animate');
		}
		
		if(faqDistance > -150) {
			$('#zombie').addClass('animate');
		} else {
			$('#zombie').removeClass('animate');
		}
	}
}).on("submit", "#giveaway-form", function() {
	if($("input[name=code]").val() != "FREETIX19HH") {
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
