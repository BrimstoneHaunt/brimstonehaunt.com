module.exports = {
	employees: function(req, res) {
		return res.view('employees', {
			layout: 'management',
    		title: "Employees",
			isLoggedIn: req.session.isLoggedIn,
			canAdmin: req.session.canAdmin,
			user: req.session.user
		});
	}		
}