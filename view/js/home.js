$.extend(pages, {
	home: {
		topSwiper: null,
		init: function() {
			console.info("Initiating Home Page...");
			pages.home.countdown.start();
			pages.home.topSwiper = new Swiper('.swiper-container', {
				direction: 'horizontal',
				loop: true,
				nextButton: '.swiper-button-next',
				prevButton: '.swiper-button-prev',
				pagination: '.swiper-pagination',
				paginationClickable: true,
				autoHeight: true,
				autoplay: 3000,
				grabCursor: true,
				effect: 'slide',
				spaceBetween: 25
			});
			// $('#teaser-video').on('click', function(){
			// 	if($('#teaser-video').get(0).paused)
			// 	{
			// 		$('#teaser-video').get(0).play();
			// 		$('#teaser-video').fadeTo(1000, 1);
			// 	}
			// 	else
			// 	{
			// 		$('#teaser-video').get(0).pause();
			// 		$('#teaser-video').fadeTo(1000, 0);
			// 	}
			// });
			// $('#teaser-video').get(0).addEventListener('ended', function(){
			// 	$('#teaser-video').get(0).webkitExitFullScreen()
			// 	$('#teaser-video').fadeTo(500, 0);
			// });
			// $('#teaser-video').get(0).addEventListener('webkitendfullscreen', function(){
			// 	$('#teaser-video').fadeTo(1000, 0);
			// });
		},
		deinit: function() {
			console.info("De-initiating Home Page...");
			pages.home.countdown.stop();
			// $('#teaser-video').get(0).pause();
		},
		scrollTo: function(section) {
			if($('#main_nav .navbar-collapse').attr('aria-expanded'))
			{
				$('#main-nav').collapse('hide');
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
		},
		countdown: {
			openingDate: new Date("Sep 22, 2017 19:00:00").getTime(),
			timer: null,
			update: function() {
				var now = new Date().getTime();
				var distance = pages.home.countdown.openingDate - now;
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
				pages.home.countdown.timer = setInterval(pages.home.countdown.update, 1000);
			},
			stop: function() {
				clearInterval(pages.home.countdown.timer);
			}
		},
		openFarewellLetter: function() {
			newModal({
				name: "farewell-letter",
				title: "The Danishek's Farewell Letter",
				body: "<p>Ecclesiastes 3 tells us:<br/><span class='verse-quote'><i>For everything there is a season,</i></span><br/><span class='verse-quote'><i>and a time for every matter under heaven</i></span></p><p>For Jennifer and I, this season is coming to an end.<br/>We moved to the farm in 2002 to change the way we were raising our children. Teaching them the value of hard work and to persevere through adversities, to raise them in an environment that would prepare them for life. Now our boys have turned into great young men, our daughter into a strong women. We feel its time to look at the next season of our life. The reality that I am no longer 33 hit me pretty hard this year, although I still love climbing trees to hang lights, it doesn’t come without consequences.</p><p>We have been blessed with the best crew I have had the pleasure working with<ul class='farewell-letter-list'><li>To the creative team who’s mission is to deliver the perfect setting</li><li>To the build team for the hundreds of thousand screws driven into pressure treated lumber</li><li>To the make up team for getting all ghouls and ghost deployed under pressure</li><li>To the Safety team for handling all that comes at you,<br/>(although my favorite nights are the one’s you got to sit quietly and do nothing)</li><li>To the drivers who safely navigated countless wagons though the dark</li><li>To the thousands who worked out here over the last 15 years entertaining and providing an excelent experience</li><li>To my parents, family and friends for selflessly serving in whatever capacity needed.<br/>You had no idea how important Halloween would become in your lives</li></ul>And finally to all the folks who made the Springboro Haunted Hayride and Black Bog a fall family tradition</p><p>We say, Thank you!</p><p>We truly value all the friendships built over the years, some will last a lifetime.<br/>We are so thankful you have been part of our crazy extended family.</p><p>Although this will be the last season, we want to make sure we remember it as our BEST season!</p><p>With that being said, next weekend will be the last time you will hear us say...</p><p>“Last wagon over the hill”</p><p>– Bill Danishek</p>",
				footer: "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>"
			});
		} 
	}
});
