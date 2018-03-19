module.exports = {
	index: function(req, res) {
		if(req.body.code == "FREETIX18HH") {
			Giveaway.find({email: req.body.email}).exec(function(err, records) {
				if(err) {
					return res.view('giveaway', {
						layout: 'simple',
						title: 'Giveaway',
						message: "We are unable to process your entry at this time. Please tray again later."
					});
				}else if(records.length > 0) {
					return res.view('giveaway', {
						layout: 'simple',
						title: 'Giveaway',
						message: "You have already been entered in this giveaway. Only one entry per person is allowed."
					});
				} else {
					Giveaway.create({email: req.body.email}).exec(function(err, records) {
						if(err) {
							return res.view('giveaway', {
								layout: 'simple',
								title: 'Giveaway',
								message: "We are unable to process your entry at this time. Please make sure you entered a valid email address and try again later."
							});
						}
						
						return res.view('giveaway', {
							layout: 'simple',
							title: 'Giveaway',
							message: 'You have been entered into our giveaway!'
						});
					});
				}
			});
		} else {
			return res.view('giveaway', {
				layout: 'simple',
				title: 'Giveaway',
				message: "Invalid Code! The correct code for this giveaway can be found on our flier."
			});
		}
	}
}