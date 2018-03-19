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

/* ----------------------------------------------------
  |                                                    |
  |	INIT                                               |
  |                                                    |
   ---------------------------------------------------- */
   
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
}).on("submit", "#giveaway-form", function() {
	if($("input[name=code]").val() != "FREETIX18HH") {
		alert("Invalid Code! The correct code for this giveaway can be found on our flier.");
		return false;
	}
});
