/* ----------------------------------------------------
  |                                                    |
  |	GLOBALS                                            |
  |                                                    |
   ---------------------------------------------------- */
   
var scrollOffset = 100;
var homePageBanner = null;
var countdown = {
	openingDate: new Date("Sep 28, 2018 19:00:00").getTime(),
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
}).on("click", "#app-list > .list-group-item-action", function() {
	var appID = $(this).data("appid");
	
	$($(this).data("target")).slideToggle();
	$(this).toggleClass("active");
});
