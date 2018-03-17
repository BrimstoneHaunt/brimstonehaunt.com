module.exports = {
	updateSessionWithUser: function(options, done) {
		options.session.isLoggedIn = true;
		options.session.userId = options.user.id;
		options.session.isAdmin = options.user.accessLvl >= 5;
	}
}