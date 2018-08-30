/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

	/***************************************************************************
	*                                                                          *
	* Default policy for all controllers and actions (`true` allows public     *
	* access)                                                                  *
	*                                                                          *
	***************************************************************************/

	'*': false,
	'MiscController': {
		'employees': 'isLoggedIn'
	},
	'GiveawayController': {
		'*': true
	},
	'TimeClockController': {
		'*': 'isLoggedIn',
		'showExport': 'isAdmin',
		'export': 'isAdmin'
	},
	'UserController': {
		'showCreate': 'canAdmin',
		'create': 'canAdmin',
		'login': true,
		'logout': true,
		'showChangePassword': 'isLoggedIn',
		'changePassword': true,
		'account': 'isLoggedIn',
		'update': 'isLoggedIn',
		'list': 'canAdmin',
		'resetPassword': true,
		'showResetPassword': true,
		'adminUpdate': 'canAdmin',
		'resetPasswordForUser': 'canAdmin',
		'adminDelete': 'canAdmin',
		'getAppDataDisplay': 'canAdmin'
	},
	'AdminController': {
		'*': 'canAdmin'
	},
	'ApplicationController': {
		'*': true,
		'pendingList': 'canAdmin',
		'heldList': 'canAdmin',
		'rejectedList': 'canAdmin',
		'hire': 'canAdmin',
		'hold': 'canAdmin',
		'reject': 'canAdmin'
	}
};
