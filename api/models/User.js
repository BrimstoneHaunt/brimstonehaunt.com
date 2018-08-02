/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const bcrypt = require('bcrypt-nodejs');

module.exports = {
	attributes: {
		email: {
			type: 'email',		
			required: true,
			unique: true
		},
		password: {
			type: 'string',
			required: true
		},
		isTempPassword: {
			type: 'boolean',
			required: true,
			defaultsTo: true
		},
		accessLvl: {
			type: 'integer',
			required: true,
			defaultsTo: '1'
		},
		payrate: {
			type: 'integer',
			required: false,
			defaultsTo: '10'
		},
		firstName: {
			type: 'string',
			required: true,
		},
		middleName: {
			type: 'string',
			required: false,
		},
		lastName: {
			type: 'string',
			required: true,
		},
		timeEntries: {
			collection: 'timeclock',
			via: 'user'
		},
		isDeleted: {
			type: 'boolean',
			required: true,
			defaultsTo: false
		},
	},
	customToJSON: function() {
		return _.omit(this, ['password'])
	},
	beforeCreate: function(user, cb) {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(user.password, salt, null, function(err, hash) {
				if(err) return cb(err);
				user.password = hash;
				return cb();
			});
		});
	},
	beforeUpdate: function(user, cb) {
		if(user.password) {
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(user.password, salt, null, function(err, hash) {
					if(err) return cb(err);
					user.password = hash;
					return cb();
				});
			});
		} else {
			return cb();
		}
	}
};
