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
			title: 'Create User',
			isLoggedIn: req.session.isLoggedIn,
			canAdmin: req.session.canAdmin,
			user: req.session.user
		});
	},
	create: function(req, res) {
		var pass = req.body.password;

		if(!req.body.password) {
			pass = (req.body.firstName.charAt(0) + req.body.lastName + "123").toLowerCase();
		}

		User.create({email: req.body.email, password: pass, accessLvl: req.body.accessLvl, firstName: req.body.firstName, middleName: req.body.middleName, lastName: req.body.lastName, payrate: req.body.payrate}).exec(function(err, records) {
			if(err) {
				return res.redirect("/user/create");
			}
			
			return res.redirect("/user/list");
		});
	},
	login: function(req, res) {	
		AuthenticationService.authenticateUser({ email: req.body.email, password: req.body.password, session: req.session }, function(err, message, needPasswordChange) {
			if(err) {
				return res.view('login', {
					layout: 'management',
					title: "Login",
					message: message
				});
			} else if(needPasswordChange) {
				return res.view('changepassword', {
					layout: 'management',
					title: "Change Password",
					email: req.body.email
				});
			} else {
				if(req.session.redirectURL) {
					return res.redirect(req.session.redirectURL);
				} else {
					return res.redirect("/employees");
				}
			}
		});
	},
	logout: function(req, res) {
		req.session.destroy(function(err) {
			return res.redirect("/login");
		});
	},
	account: function(req, res) {
		return res.view('account', {
			layout: 'management',
			title: 'Account',
			isLoggedIn: req.session.isLoggedIn,
			canAdmin: req.session.canAdmin,
			user: req.session.user
		});
	},
	update: function(req, res) {
		User.update({ id: req.session.user.id, isDeleted: false }, { firstName: req.body.firstName, middleName: req.body.middleName, lastName: req.body.lastName, email: req.body.email }).exec(function(err, records) {
			if(err) {
				return res.view('account', {
					layout: 'management',
					title: 'Account',
					isLoggedIn: req.session.isLoggedIn,
					canAdmin: req.session.canAdmin,
					user: req.session.user,
					message: "Something went wrong. Unable to update account."
				});
			} else {
				SessionService.updateSessionWithUser({ session: req.session, user: records[0] }, function() {
					return res.view('account', {
						layout: 'management',
						title: 'Account',
						isLoggedIn: req.session.isLoggedIn,
						canAdmin: req.session.canAdmin,
						user: req.session.user,
						message: "Account updated successfully."
					});
				});
			}
		});
	},
	showChangePassword: function(req, res) {
		return res.view('changepassword', {
			layout: 'management',
			title: "Change Password",
			isLoggedIn: req.session ? req.session.isLoggedIn : false,
			canAdmin: req.session ? req.session.canAdmin : false,
			email: req.session ? req.session.user.email : null,
			user: req.session ? req.session.user : null
		});
	},
	changePassword: function(req, res) {
		if(req.body.newPassword == req.body.password || req.body.confirmNewPassword == req.body.password) {
			return res.view('changepassword', {
				layout: 'management',
				title: "Change Password",
				email: req.body.email,
				isLoggedIn: req.session ? req.session.isLoggedIn : false,
				canAdmin: req.session ? req.session.canAdmin : false,
				user: req.session ? req.session.user : null,
				message: "New password cannot be the same as the current password!"
			});
		} else if(req.body.newPassword == req.body.confirmNewPassword) {
			AuthenticationService.authenticateUser({ email: req.body.email, password: req.body.password, session: req.session }, function(err, message, needPasswordChange) {
				if(err) {
					return res.view('changepassword', {
						layout: 'management',
						title: "Change Password",
						isLoggedIn: req.session ? req.session.isLoggedIn : false,
						canAdmin: req.session ? req.session.canAdmin : false,
						email: req.body.email,
						user: req.session ? req.session.user : null,
						message: message
					});
				} else {
					User.update({ email: req.body.email, isDeleted: false }, { password: req.body.newPassword, isTempPassword: false }).exec(function(err, records) {
						if(err) {
							return res.view('changepassword', {
								layout: 'management',
								title: "Change Password",
								isLoggedIn: req.session ? req.session.isLoggedIn : false,
								canAdmin: req.session ? req.session.canAdmin : false,
								email: req.body.email,
								user: req.session ? req.session.user : null,
								message: "Something went wrong. Please try again."
							});
						} else if(req.session) {
							req.session.destroy(function(err) {
								return res.view('login', {
									layout: 'management',
									title: "Login",
									message: "Your password has been changed."
								});
							});
						} else {
							return res.view('login', {
								layout: 'management',
								title: "Login",
								message: "Your password has been changed."
							});
						}
					});
				}
			});
		} else {
			return res.view('changepassword', {
				layout: 'management',
				title: "Change Password",
				isLoggedIn: req.session ? req.session.isLoggedIn : false,
				canAdmin: req.session ? req.session.canAdmin : false,
				email: req.body.email,
				user: req.session ? req.session.user : null,
				message: "New passwords did not match!"
			});
		}
	},
	showResetPassword: function(req, res) {
		return res.view('resetpassword', {
			layout: 'management',
			title: "Reset Password"
		});
	},
	resetPassword: function(req, res) {
		User.find({email: req.body.email, isDeleted: false}).exec(function(err, records) {
			if(err) 
			{
				console.log(err);
				return res.view('login', {
					layout: 'management',
					title: "Login",
					message: "Something went wrong. Unable to reset password."
				});
			} 
			else if(records.length == 1) 
			{
				User.update({ id: records[0].id }, { password: (records[0].firstName.charAt(0) + records[0].lastName + "123").toLowerCase(), isTempPassword: true }).exec(function(err, records) {
					if(err) {
						console.log(err);
						return res.view('login', {
							layout: 'management',
							title: "Login",
							message: "Something went wrong. Unable to reset password."
						});
					} else {
						return res.view('login', {
							layout: 'management',
							title: "Login",
							message: "Your password has been reset. Please check your email."
						});
					}
				});
			}
			else if(records.length == 0) 
			{
				return res.view('login', {
					layout: 'management',
					title: "Login",
					message: "Unable to find user!"
				});
			}
			else
			{
				return res.view('login', {
					layout: 'management',
					title: "Login",
					message: "Something went wrong. Unable to reset password."
				});
			}
		});
	},
	resetPasswordForUser: function(req, res) {
		User.find({id: req.body.userid, isDeleted: false}).exec(function(err, records) {
			if(err) 
			{
				console.log(err);
				return res.json({ success: false, message: "Something went wrong. Unable to reset password." });
			} 
			else if(records.length == 1) 
			{
				User.update({ id: records[0].id }, { password: (records[0].firstName.charAt(0) + records[0].lastName + "123").toLowerCase(), isTempPassword: true }).exec(function(err, records) {
					if(err) {
						console.log(err);
						return res.json({ success: false, message: "Something went wrong. Unable to reset password." });
					} else {
						return res.json({ success: true, message: "User's password has been reset." });
					}
				});
			}
			else if(records.length == 0) 
			{
				return res.json({ success: false, message: "Unable to find user!" });
			}
			else
			{
				return res.json({ success: false, message: "Something went wrong. Unable to reset password." });
			}
		});
	},
	list: function(req, res) {
		User.find({isDeleted: false}).sort('lastName ASC').sort('firstName ASC').exec(function(err, records) {
			return res.view('accountlist', {
				layout: 'management',
				title: 'Account List',
				isLoggedIn: req.session.isLoggedIn,
				canAdmin: req.session.canAdmin,
				user: req.session.user,
				accountList: records
			});
		});
	},
	adminUpdate: function(req, res) {		
		User.update({id: req.body.id, isDeleted: false}, {email: req.body.email, accessLvl: req.body.accessLvl, payrate: req.body.payrate, firstName: req.body.first, middleName: req.body.middle, lastName: req.body.last}).exec(function(err, records) {
			if(err) {
				return res.serverError(err);
			}
			
			return res.redirect("/user/list");
		});
	},
	adminDelete: function(req, res) {		
		User.update({id: req.body.id, isDeleted: false}, {isDeleted: true}).exec(function(err, records) {
			if(err) {
				return res.serverError(err);
			}
			
			return res.redirect("/user/list");
		});
	}
};
