module.exports = {
	updateSessionWithUser: function(options, done) {
		options.session.isLoggedIn = true;
		options.session.user = options.user;
		options.session.canAdmin = options.user.accessLvl >= 2;
		
		return done();
	}
}