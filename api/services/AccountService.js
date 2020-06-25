module.exports = {
	createAccount: function(options, done) {
		var pass = options.password;

		if(!options.password) {
			pass = (options.firstName.charAt(0) + options.lastName + "123").toLowerCase();
		}

		User.create({email: options.email, password: pass, accessLvl: options.accessLvl, firstName: options.firstName, middleName: options.middleName, lastName: options.lastName, payrate: options.payrate, application: options.application, position: options.position}).exec(function(err, records) {
			if(err) {
				console.log(err);
				return done(true);
			}
			
			return done(false);
		});
	}
}