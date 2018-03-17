/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const bcrypt = require('bcrypt-nodejs');

module.exports = {
	showCreate: function(req, res) {
		return res.view('createuser', {
			layout: 'management',
			title: 'Create User'
		});
	},
	create: function(req, res) {
		User.create({email: req.body.email, password: req.body.password, accessLvl: req.body.accessLvl}).exec(function(err, records) {
			if(err) {
				return res.serverError(err);
			}
			
			return res.ok();
		});
	},
	login: function(req, res) {				
		User.find({email: req.body.email}).exec(function(err, records) {
			if(err) 
			{
				console.log(err);
				req.session.destroy(function(err) {
					return res.view('login', {
						layout: 'management',
						title: "Login",
						message: "Something went wrong. Unable to login."
					});
				});
			} 
			else if(records.length == 1) 
			{
				var user = records[0];
				if(!bcrypt.compareSync(req.body.password, user.password)) {
					req.session.destroy(function(err) {
						return res.view('login', {
							layout: 'management',
							title: "Login",
							message: "Wrong Password!"
						});
					});
				}
				else
				{
					SessionService.updateSessionWithUser({ session: req.session, user: user });
					if(req.session.redirectURL) {
						return res.redirect(req.session.redirectURL);
					} else {
						return res.redirect("/");
					}
				}
			}
			else if(records.length == 0) 
			{
				req.session.destroy(function(err) {
					return res.view('login', {
						layout: 'management',
						title: "Login",
						message: "Unable to find user!"
					});
				});
			}
			else
			{
				req.session.destroy(function(err) {
					return res.view('login', {
						layout: 'management',
						title: "Login",
						message: "Something went wrong. Unable to login."
					});
				});
			}
		});
	},
	logout: function(req, res) {
		if(!req.session.isLoggedIn) {
			return res.serverError("Not logged in!");
		}
		
		req.session.destroy(function(err) {
			return res.ok();
		});
	}
};
