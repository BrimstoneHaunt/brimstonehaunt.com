var moment = require('moment-timezone');

module.exports = {
	index: function(req, res) {
		User.count({isDeleted: false}, function(err1, count1) {
			Timeclock.count({startTime: {'!': null }, endTime: null}, function(err2, count2) {
				Application.count({status: 1}, function(err3, count3) {
					Application.count({status: 3}, function(err4, count4) {
						Application.count({status: 4}, function(err5, count5) {
							if(err1 || err2 || err3 || err4 || err5) {
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
									user: req.session.user
								});
							}
						});
					});
				});
			});
		});
	}		
}