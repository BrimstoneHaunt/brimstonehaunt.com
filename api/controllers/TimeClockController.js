var moment = require('moment-timezone');

function formatCurrency(amount) {
	var numericAmount = amount;
    var pennies = Math.round(numericAmount * 100);
    var cents = pennies % 100;
    var dollars = Math.round(pennies / 100 - cents / 100);
    var centsStr = '' + cents;
    var result = '$' + dollars + '.' + ( centsStr.length < 2 ? '0'+cents : cents);

    return '$' + dollars + '.' + ( centsStr.length < 2 ? '0' + cents : cents);
}

module.exports = {
	index: function(req, res) {
		Timeclock.find({user: req.session.user.id}).sort('startTime DESC').exec(function(err1, records1) {
			if(err1) 
			{
				console.log(err1);
				return res.serverError(err1);
			} else {
				Timeclock.find({user: req.session.user.id, startTime: {'!': null }, endTime: null}).exec(function(err2, records2) {
					if(err2) {
						console.log(err2);
						return res.serverError(err2);
					} else {
						var finalData = [];
						records1.forEach(function(elem) {
							var start = elem.startTime;
							var end = elem.endTime;
							var diffHrs = (((((end ? end : new Date()) - start) / 1000) / 60) / 60);
							var duration = (Math.round(diffHrs * 4) / 4).toFixed(2);
							var startMoment = moment(start);
							var endMoment = end ? moment(end) : null;
							var startTimeLocal = startMoment.tz('America/New_York').format('YYYY-MM-DDTHH:mm');
							var endTimeLocal = end ? endMoment.tz('America/New_York').format('YYYY-MM-DDTHH:mm') : "";
							
							finalData.push({ 
								id: elem.id,
								startTime: startMoment.tz('America/New_York').format('ddd, MMM D, YYYY h:mm A'),
								endTime: endMoment ? endMoment.tz('America/New_York').format('ddd, MMM D, YYYY h:mm A') : "", 
								startTimeLocal: startTimeLocal,
								endTimeLocal: endTimeLocal,
								comments: elem.comments, 
								duration: duration + " hrs" 
							});
						});
						
						return res.view('timeclock', {
							layout: 'management',
							title: 'Time Clock',
							isLoggedIn: req.session.isLoggedIn,
							canAdmin: req.session.canAdmin,
							user: req.session.user,
							timeEntries: finalData,
							clockedIn: (records2.length > 0)
						});
					}
				});
			}
		});
	},
	clockin: function(req, res) {
		var now = new Date();
		var start = now;
		var end = null;
		var comments = null;
		
		if(req.body.startTime) {
			var start = moment.tz(req.body.startTime, 'YYYY-MM-DDTHH:mm', 'America/New_York').toDate();
			var end = req.body.endTime ? moment.tz(req.body.endTime, 'YYYY-MM-DDTHH:mm', 'America/New_York').toDate() : null;
			comments = req.body.comments;
		}
		
		Timeclock.find({user: req.session.user.id, startTime: {'!': null }, endTime: null}).exec(function(err1, records1) {
			if(err1) {
				console.log(err1);
				return res.serverError(err1);
			} else if (records1.length > 0) {
				return res.serverError("Already clocked in!");
			} else {
				Timeclock.create({startTime: start, endTime: end, comments: comments, user: req.session.user.id}).exec(function(err2, records2) {
					if(err2) {
						return res.serverError(err2);
					}
					
					return res.redirect("/timeclock");
				});
			}
		});
	},
	clockout: function(req, res) {
		var now = new Date();
		Timeclock.update({user: req.session.user.id, startTime: {'!': null }, endTime: null}, {endTime: now}).exec(function(err, records) {
			if(err) {
				return res.serverError(err);
			}
			
			return res.redirect("/timeclock");
		});
	},
	update: function(req, res) {
		var startTime = moment.tz(req.body.startTime, 'YYYY-MM-DDTHH:mm', 'America/New_York').toDate();
		var endTime = req.body.endTime ? moment.tz(req.body.endTime, 'YYYY-MM-DDTHH:mm', 'America/New_York').toDate() : null;
		
		Timeclock.update({user: req.session.user.id, id: req.body.id}, {startTime: startTime, endTime: endTime, comments: req.body.comments}).exec(function(err, records) {
			if(err) {
				return res.serverError(err);
			}
			
			return res.redirect("/timeclock");
		});
	},
	delete: function(req, res) {		
		Timeclock.destroy({user: req.session.user.id, id: req.body.id}).exec(function(err, records) {
			if(err) {
				return res.serverError(err);
			}
			
			return res.redirect("/timeclock");
		});
	},
	showExport: function(req, res) {
		return res.view('exporttimesheets', {
			layout: 'management',
			title: 'Export Time Sheets',
			isLoggedIn: req.session.isLoggedIn,
			canAdmin: req.session.canAdmin,
			user: req.session.user
		});
	},
	export: function(req, res) {		
		var start = moment.tz(req.body.startExport, 'YYYY-MM-DD', 'America/New_York').startOf('day').toDate();
		var end = moment.tz(req.body.endExport, 'YYYY-MM-DD', 'America/New_York').endOf('day').toDate();
		
		User.find().populate('timeEntries', {where: {startTime: {'>=': start, '<=': end}, endTime: {'!': null}}, sort: 'startTime ASC'}).sort('lastName ASC').sort('firstName ASC').exec(function(err, records) {
			if(err) {
				console.log(err);
				return res.serverError("Something went wrong. Unable to export time sheet data.");
			} else {
				var CSV_STR = "Employee,Duration,Rate,Pay\r\n";
				records.forEach(function(user) {
					if(user.timeEntries.length > 0) {
						var totalDuration = 0;
						var payRate = user.payrate;
						
						user.timeEntries.forEach(function(elem) {
							var start = elem.startTime;
							var end = elem.endTime;
							var diffHrs = (((((end ? end : new Date()) - start) / 1000) / 60) / 60);

							totalDuration += diffHrs;
						});
						
						var payrateSTR = formatCurrency(payRate);
						CSV_STR += "\"" + user.firstName + " " + user.middleName + " " + user.lastName + "\"";
						CSV_STR += ",\"" + (Math.round(totalDuration * 4) / 4).toFixed(2) + " hrs\",\"" + payrateSTR + "/hr\",\"$" + (Math.round(payRate * (Math.round(totalDuration * 4) / 4).toFixed(2) * 4) / 4).toFixed(2) + "\"\r\n";
					}
				});
				
				res.set({ 'Content-Disposition': 'attachment; filename=Brimstone_Time_Sheets.csv', 'Content-Type': 'text/csv' });
				res.status(200).send(CSV_STR);
				return;
			}
		});
	},
	viewExport: function(req, res) {
		var start = moment.tz(req.body.start, 'YYYY-MM-DD', 'America/New_York').startOf('day').toDate();
		var end = moment.tz(req.body.end, 'YYYY-MM-DD', 'America/New_York').endOf('day').toDate();
		var finalData = [];
		
		User.find().populate('timeEntries', {where: {startTime: {'>=': start, '<=': end}, endTime: {'!': null}}, sort: 'startTime ASC'}).sort('lastName ASC').sort('firstName ASC').exec(function(err, records) {
			if(err) {
				console.log(err);
				return res.serverError("Something went wrong. Unable to get time sheet data.");
			} else {				
				records.forEach(function(user) {
					if(user.timeEntries.length > 0) {
						var tempData = { id: user.id, name: user.firstName + " " + user.middleName + " " + user.lastName, payRate: user.payrate, entries: [] };						
						var totalDuration = 0;
						var payRate = user.payrate;
						
						user.timeEntries.forEach(function(elem) {
							var start = elem.startTime;
							var end = elem.endTime;
							var diffHrs = (((((end ? end : new Date()) - start) / 1000) / 60) / 60);
							var duration = (Math.round(diffHrs * 4) / 4).toFixed(2);
							var startMoment = moment(start);
							var endMoment = end ? moment(end) : null;
							var startTimeLocal = startMoment.tz('America/New_York').format('ddd, MMM D, YYYY h:mm A');
							var endTimeLocal = end ? endMoment.tz('America/New_York').format('ddd, MMM D, YYYY h:mm A') : "";

							totalDuration += diffHrs;
							
							tempData.entries.push({
								startTime: startTimeLocal,
								endTime: endTimeLocal,
								duration: duration,
								comments: elem.comments,
								payRate: payRate,
								pay: (Math.round(duration * payRate * 4) / 4).toFixed(2)
							});
						});
						
						tempData.totalDuration = (Math.round(totalDuration * 4) / 4).toFixed(2);
						tempData.totalPay = (Math.round(payRate * (Math.round(totalDuration * 4) / 4).toFixed(2) * 4) / 4).toFixed(2);
						finalData.push(tempData);
					}
				});
				
				return res.view('viewTimeSheets', {
					layout: 'management',
					title: 'Time Sheets',
					isLoggedIn: req.session.isLoggedIn,
					canAdmin: req.session.canAdmin,
					user: req.session.user,
					timeClockData: finalData
				});
			}
		});
	}
}