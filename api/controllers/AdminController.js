var moment = require('moment-timezone');

module.exports = {
	index: function(req, res) {
		User.count({isDeleted: false}, function(err1, count1) {
			Timeclock.count({startTime: {'!': null }, endTime: null}, function(err2, count2) {
				Timeclock.find({startTime: {'!': null }, endTime: null}).populate('user').sort('startTime ASC').exec(function(err3, records) {
					if(err1 || err2 || err3) {
						console.log(err1);
						console.log(err2);
						console.log(err3);
						
						return res.view('admin', {
							layout: 'management',
				    		title: "Admin",
							isLoggedIn: req.session.isLoggedIn,
							canAdmin: req.session.canAdmin,
							user: req.session.user
						});
					} else {
						var timeEntries = [];
						records.forEach(function(elem) {
							var start = elem.startTime;
							var diffHrs = ((((new Date() - start) / 1000) / 60) / 60);
							var duration = (Math.round(diffHrs * 4) / 4).toFixed(2);
							var startMoment = moment(start);
							var startTimeLocal = startMoment.tz('America/New_York').format('YYYY-MM-DDTHH:mm');
							
							timeEntries.push({ 
								id: elem.id,
								startTime: startMoment.tz('America/New_York').format('ddd, MMM D, YYYY h:mm A'),
								duration: duration + " hrs",
								user: elem.user
							});
						});
						
						return res.view('admin', {
							layout: 'management',
				    		title: "Admin",
							isLoggedIn: req.session.isLoggedIn,
							canAdmin: req.session.canAdmin,
							numEmployees: count1,
							numOnClock: count2,
							timeEntries: timeEntries,
							user: req.session.user
						});
					}
				});
			});
		});
	}		
}