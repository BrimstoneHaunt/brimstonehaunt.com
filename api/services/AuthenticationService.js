const bcrypt = require('bcrypt-nodejs');

module.exports = {
	authenticateUser: function(options, done) {
		User.find({email: options.email, isDeleted: false}).populate('managedPositions').exec(function(err, records) {
			if(err) 
			{
				console.log(err);
				options.session.destroy(function(err) {
					return done(err, "Something went wrong. Unable to login.");
				});
			} 
			else if(records.length == 1) 
			{
				var user = records[0];
				if(!bcrypt.compareSync(options.password, user.password)) {
					options.session.destroy(function(err) {
						return done(true, "Wrong password!");
					});
				}
				else
				{
					if(user.isTempPassword) {
						options.session.destroy(function(err) {
							return done(false, "", true);
						});
					} else {
						SessionService.updateSessionWithUser({ session: options.session, user: user }, function() {
							return done(false, "", false);
						});
					}
				}
			}
			else if(records.length == 0) 
			{
				options.session.destroy(function(err) {
					return done(true, "Unable to find user!");
				});
			}
			else
			{
				options.session.destroy(function(err) {
					return done(true, "Something went wrong. Unable to login.");
				});
			}
		});
	}
}