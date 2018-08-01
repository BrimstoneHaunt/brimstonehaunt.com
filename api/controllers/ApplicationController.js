var moment = require('moment-timezone');

module.exports = {
	index: function(req, res) {
		return res.view('apply', {
			layout: 'simple',
			title: 'Apply'
		});
	},
	submitApplication: function(req, res) {
		Application.find({email: req.body.email}).exec(function(err1, records1) {
			if(err1) {
				console.log(err1);
				return res.view('apply', {
					layout: 'simple',
					title: 'Apply',
					message: "Something went wrong! Unable to submit application. Please try again.",
					data: req.body
				});
			} else if (records1.length > 0) {
				return res.view('apply', {
					layout: 'simple',
					title: 'Apply',
					message: "An application under this email as already been submitted. If it has been more than 3 business days and you have not heard from us, feel free to contact us at <a href='mailto:contact@brimstonehaunt.com'>contact@brimstonehaunt.com</a>.",
					data: req.body
				});
			} else {
				var over16 = req.body.over16 == 'y';
				var returning_worker = req.body.returning_worker == 'y';
				var makeup_allergies = req.body.makeup_allergies == 'y';
				var glasses = req.body.glasses == 'y';
				var contacts = req.body.contacts == 'y';
				var availability = "";
				
				req.body.availability.forEach(function(elem) {
					if(availability !== "") {
						availability += ":";
					}
					availability += elem;
				});
				
				Application.create({firstName: req.body.first, middleName: req.body.middle, lastName: req.body.last, street: req.body.street, city: req.body.city, state: req.body.state, zip: req.body.zip, email: req.body.email, phone: req.body.phone, over16: over16, returning_worker: returning_worker, previous_role: req.body.previous_role, previous_haunt_work: req.body.previous_haunt_work, comments: req.body.comments, height: req.body.height, gender: req.body.gender, shirt_size: req.body.shirt_size, pant_size: req.body.pant_size, pant_waist: req.body.pant_waist, pant_length: req.body.pant_length, makeup_allergies: makeup_allergies, glasses: glasses, contacts: contacts, availability: availability}).exec(function(err, records) {
					if(err) {
						console.log(err);
						return res.view('apply', {
							layout: 'simple',
							title: 'Apply',
							message: "Something went wrong! Unable to submit application. Please try again.",
							data: req.body
						});
					}
					
					return res.view('applyConfirmation', {
						layout: 'simple',
						title: 'Apply'
					});
				});
			}
		});
	},
	pendingList: function(req, res) {
		Application.find({status: 1}).sort('createdAt ASC').exec(function(err, records) {
			return res.view('applicationlist', {
				layout: 'management',
				title: 'Application List',
				isLoggedIn: req.session.isLoggedIn,
				canAdmin: req.session.canAdmin,
				user: req.session.user,
				appListType: "Pending",
				appList: records
			});
		});
	},
	heldList: function(req, res) {
		Application.find({status: 3}).sort('createdAt ASC').exec(function(err, records) {
			return res.view('applicationlist', {
				layout: 'management',
				title: 'Application List',
				isLoggedIn: req.session.isLoggedIn,
				canAdmin: req.session.canAdmin,
				user: req.session.user,
				appListType: "Held",
				appList: records
			});
		});
	}		
}