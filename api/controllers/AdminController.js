var moment = require('moment-timezone');

module.exports = {
	index: function(req, res) {
		User.count({isDeleted: false}, function(err1, count1) {
			Timeclock.count({startTime: {'!': null }, endTime: null}, function(err2, count2) {
				Application.count({status: 1}, function(err3, count3) {
					Application.count({status: 3}, function(err4, count4) {
						Application.count({status: 4}, function(err5, count5) {
							Timeclock.find({startTime: {'!': null }, endTime: null}).populate('user').sort('startTime ASC').exec(function(err, records) {
								if(err || err1 || err2 || err3 || err4 || err5) {
									console.log(err);
									console.log(err1);
									console.log(err2);
									console.log(err3);
									console.log(err4);
									console.log(err5);
									
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
										numPendingApps: count3,
										numHeldApps: count4,
										numRejectedApps: count5,
										timeEntries: timeEntries,
										user: req.session.user
									});
								}
							});
						});
					});
				});
			});
		});
	}		
}