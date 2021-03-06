/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // Public Pages
  
  'get /': {
    view: 'homepage',
    locals: {
    	homepage: true,
    	title: "4 Great Scares for the Family and the Brave"
    }
  },
  'get /news': {
    view: 'news',
    locals: {
      layout: 'simple',
    	title: "Press Releases"
    }
  },
  'get /policies': {
    view: 'policies',
    locals: {
      layout: 'simple',
    	title: "Policies"
    }
  },
  'get /giveaway': {
    view: 'giveaway',
    locals: {
	    layout: 'simple',
    	title: "Giveaway"
    }
  },
  'post /giveaway': 'GiveawayController.index',
  'get /apply': 'ApplicationController.index',
  'post /apply': 'ApplicationController.submitApplication',
  
  // Employee Pages
  
  'get /employees': 'MiscController.employees',
  'get /timeclock': 'TimeClockController.index',
  'post /timeclock/clockin': 'TimeClockController.clockin',
  'post /timeclock/clockout': 'TimeClockController.clockout',
  'post /timeclock/update': 'TimeClockController.update',
  'post /timeclock/update/comment': 'TimeClockController.updateComment',
  'post /timeclock/delete': 'TimeClockController.delete',
  'get /badgescan': {
    view: 'badgescanauth',
    locals: {
      layout: 'management_simple',
      title: "Badge Scan"
    }
  },
  'post /badgescan': 'TimeClockController.badgescan',
  'post /badgescanClockInOut': 'TimeClockController.badgescanClockInOut',
  
  // User Account Stuff
  
  'get /login': {
  	view: 'login',
    locals: {
    	layout: 'management',
    	title: "Login"
    }
  },
  'post /login': 'UserController.login',
  'get /logout': 'UserController.logout',
  'post /logout': 'UserController.logout',
  'get /user/account': 'UserController.account',
  'post /user/account': 'UserController.update',
  'get /user/changepassword': 'UserController.showChangePassword',
  'post /user/changepassword': 'UserController.changePassword',
  'get /user/resetpassword': 'UserController.showResetPassword',
  'post /user/resetpassword': 'UserController.resetPassword',
  
  // Admin Pages
  
  'get /admin': 'AdminController.index',
  'get /positions': 'AdminController.showPositions',
  'post /positions/create': 'AdminController.createPosition',
  'post /positions/update': 'AdminController.updatePosition',
  'post /positions/delete': 'AdminController.deletePosition',
  'get /user/create': 'UserController.showCreate',
  'post /user/create': 'UserController.create',
  'get /user/list': 'UserController.list',
  'get /user/list/deleted': 'UserController.listDeleted',
  'post /timeclock/user': 'TimeClockController.timeSheetForUser',
  'get /timeclock/clockedin': 'TimeClockController.clockedIn',
  'post /timeclock/clockout/user': 'TimeClockController.clockoutUser',
  'post /timeclock/clockout/all': 'TimeClockController.clockoutAll',
  'post /user/app': 'UserController.getAppDataDisplay',
  'post /user/adminupdate': 'UserController.adminUpdate',
  'post /user/adminresetpassword': 'UserController.resetPasswordForUser',
  'get /timeclock/export': 'TimeClockController.showExport',
  'post /timeclock/export': 'TimeClockController.export',
  'post /timeclock/view': 'TimeClockController.viewExport',
  'post /user/admindeleteaccount': 'UserController.adminDelete',
  'post /user/adminundeleteaccount': 'UserController.adminUndelete',
  'get /applications/pending': 'ApplicationController.pendingList',
  'get /applications/held': 'ApplicationController.heldList',
  'get /applications/rejected': 'ApplicationController.rejectedList',
  'post /application/hire': 'ApplicationController.hire',
  'post /application/hold': 'ApplicationController.hold',
  'post /application/reject': 'ApplicationController.reject',
  'post /application/saveadminnote': 'ApplicationController.saveadminnote',
  'post /application/move': 'ApplicationController.move',
  'get /admin/badgescanauth': 'AdminController.getBadgescanauth',
  'post /admin/badgescanauth': 'AdminController.setBadgescanauth',
  'post /admin/badges': 'AdminController.viewBadges',
  'post /timeclock/adminAddEntry': 'TimeClockController.adminAddEntry'

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
