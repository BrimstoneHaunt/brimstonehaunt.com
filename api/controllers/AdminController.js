var moment = require('moment-timezone');

module.exports = {
    index: function(req, res) {
        if(req.session.user.accessLvl < 4) {
            User.count({isDeleted: false, position: req.session.user.position}, function(err1, count1) {
                Timeclock.find({startTime: {'!': null }, endTime: null}).populate('user').exec(function(err2, records) {
                    Application.count({status: 1, position: req.session.user.position}, function(err3, count3) {
                        Application.count({status: 3, position: req.session.user.position}, function(err4, count4) {
                            Application.count({status: 4, position: req.session.user.position}, function(err5, count5) {
                                User.count({isDeleted: true, position: req.session.user.position}, function(err6, count6) {
                                    if(err1 || err2 || err3 || err4 || err5 || err6) {
                                        console.log(err1);
                                        console.log(err2);
                                        console.log(err3);
                                        console.log(err4);
                                        console.log(err5);
                                        console.log(err6);
                                        
                                        return res.view('admin', {
                                            layout: 'management',
                                            title: "Admin",
                                            isLoggedIn: req.session.isLoggedIn,
                                            canAdmin: req.session.canAdmin,
                                            user: req.session.user
                                        });
                                    } else {
                                        var count2 = 0;
                                        for(var i = 0;i < records.length;i++) {
                                            if(records[i].user.position == req.session.user.position) {
                                                count2++;
                                            }
                                        }

                                        return res.view('admin', {
                                            layout: 'management',
                                            title: "Admin",
                                            isLoggedIn: req.session.isLoggedIn,
                                            canAdmin: req.session.canAdmin,
                                            numEmployees: count1,
                                            numDeletedEmployees: count6,
                                            numOnClock: count2,
                                            numPendingApps: count3,
                                            numHeldApps: count4,
                                            numRejectedApps: count5,
                                            user: req.session.user
                                        });
                                    }
                                });
                            });
                        });
                    });
                });
            });
        } else if(req.session.user.accessLvl == 4) {
            var managedPositionIDs = [];
            for(var i = 0;i < req.session.user.managedPositions.length;i++) {
                managedPositionIDs.push(req.session.user.managedPositions[i].id);
            }

            User.count({isDeleted: false, position: managedPositionIDs}, function(err1, count1) {
                Timeclock.find({startTime: {'!': null }, endTime: null}).populate('user').exec(function(err2, records) {
                    Application.count({status: 1, position: managedPositionIDs}, function(err3, count3) {
                        Application.count({status: 3, position: managedPositionIDs}, function(err4, count4) {
                            Application.count({status: 4, position: managedPositionIDs}, function(err5, count5) {
                                User.count({isDeleted: true, position: managedPositionIDs}, function(err6, count6) {
                                    if(err1 || err2 || err3 || err4 || err5 || err6) {
                                        console.log(err1);
                                        console.log(err2);
                                        console.log(err3);
                                        console.log(err4);
                                        console.log(err5);
                                        console.log(err6);
                                        
                                        return res.view('admin', {
                                            layout: 'management',
                                            title: "Admin",
                                            isLoggedIn: req.session.isLoggedIn,
                                            canAdmin: req.session.canAdmin,
                                            user: req.session.user
                                        });
                                    } else {
                                        var count2 = 0;
                                        for(var i = 0;i < records.length;i++) {
                                            if(managedPositionIDs.includes(records[i].user.position)) {
                                                count2++;
                                            }
                                        }

                                        return res.view('admin', {
                                            layout: 'management',
                                            title: "Admin",
                                            isLoggedIn: req.session.isLoggedIn,
                                            canAdmin: req.session.canAdmin,
                                            numEmployees: count1,
                                            numDeletedEmployees: count6,
                                            numOnClock: count2,
                                            numPendingApps: count3,
                                            numHeldApps: count4,
                                            numRejectedApps: count5,
                                            user: req.session.user
                                        });
                                    }
                                });
                            });
                        });
                    });
                });
            });
        } else {
            User.count({isDeleted: false}, function(err1, count1) {
                Timeclock.count({startTime: {'!': null }, endTime: null}, function(err2, count2) {
                    Application.count({status: 1}, function(err3, count3) {
                        Application.count({status: 3}, function(err4, count4) {
                            Application.count({status: 4}, function(err5, count5) {
                                User.count({isDeleted: true}, function(err6, count6) {
                                    if(err1 || err2 || err3 || err4 || err5 || err6) {
                                        console.log(err1);
                                        console.log(err2);
                                        console.log(err3);
                                        console.log(err4);
                                        console.log(err5);
                                        console.log(err6);
                                        
                                        return res.view('admin', {
                                            layout: 'management',
                                            title: "Admin",
                                            isLoggedIn: req.session.isLoggedIn,
                                            canAdmin: req.session.canAdmin,
                                            user: req.session.user
                                        });
                                    } else {
                                        return res.view('admin', {
                                            layout: 'management',
                                            title: "Admin",
                                            isLoggedIn: req.session.isLoggedIn,
                                            canAdmin: req.session.canAdmin,
                                            numEmployees: count1,
                                            numDeletedEmployees: count6,
                                            numOnClock: count2,
                                            numPendingApps: count3,
                                            numHeldApps: count4,
                                            numRejectedApps: count5,
                                            user: req.session.user
                                        });
                                    }
                                });
                            });
                        });
                    });
                });
            });
        }
    },
    showPositions: function(req, res) {
        Position.find({isDeleted: false}).exec(function(err, records) {
            return res.view('positions', {
                layout: 'management',
                title: "Positions",
                isLoggedIn: req.session.isLoggedIn,
                canAdmin: req.session.canAdmin,
                user: req.session.user,
                positions: records
            });
        });
    },
    createPosition: function(req, res) {
        Position.create({
            title: req.body.title,
            defaultPayRate: req.body.defaultPayrate,
            parentPosition: req.body.parentPosition,
            canApply: req.body.canApply
        }).exec(function(err, records) {
            if(err) {
                console.log(err);
                return res.serverError(err);
            }
            
            return res.redirect("/positions");
        });
    },
    updatePosition: function(req, res) {
        Position.update({id: req.body.id}, {
            title: req.body.title,
            defaultPayRate: req.body.defaultPayrate,
            canApply: req.body.canApply
        }).exec(function(err, records) {
            if(err) {
                console.log(err);
                return res.serverError(err);
            }
            
            return res.redirect("/positions");
        });
    },
    deletePosition: function(req, res) {
        User.update({position: req.body.id}, {position: null}).exec(function(err1, records1) {
            if(err1) {
                console.log(err1);
                return res.serverError(err1);
            }

            Position.update({id: req.body.id}, {isDeleted: true}).exec(function(err2, records2) {
                if(err2) {
                    console.log(err2);
                    return res.serverError(err2);
                }
                
                return res.redirect("/positions");
            });
        });
    },
    getBadgescanauth: function(req, res) {
        Badgescan.find().exec(function(err, records) {
            if(err) {
                console.log(err);
                return res.serverError(err);
            } else {
                if(records.length > 1) {
                    console.log("Bad Authcode Setup!");
                    return res.serverError("Bad Authcode Setup!");
                } else {
                    User.find({isDeleted: false}).sort('lastName ASC').sort('firstName ASC').exec(function(err2, records2) {
                        if(err2) {
                            console.log(err2);
                            return res.serverError(err2);
                        } else {
                            return res.view('badgescanauthcode', {
                                layout: 'management',
                                title: "Admin",
                                authcode: records.length == 0 ? "" : records[0].authcode,
                                users: records2,
                                isLoggedIn: req.session.isLoggedIn,
                                canAdmin: req.session.canAdmin,
                                user: req.session.user
                            });
                        }
                    });
                }
            }
        });
    },
    setBadgescanauth: function(req, res) {
        var pass = req.body.authcode;

        Badgescan.find().exec(function(err, records) {
            if(err) {
                console.log(err);
                return res.serverError(err);
            } else {
                if(records.length > 1) {
                    console.log("Bad Authcode Setup!");
                    return res.serverError("Bad Authcode Setup!");
                } else {
                    if(records.length == 0) {
                        Badgescan.create({authcode: pass}).exec(function(err2, records) {
                            if(err2) {
                                console.log(err2);
                                return res.serverError(err2);
                            } else {
                                User.find({isDeleted: false}).sort('lastName ASC').sort('firstName ASC').exec(function(err3, records3) {
                                    if(err3) {
                                        console.log(err3);
                                        return res.serverError(err3);
                                    } else {
                                        return res.view('badgescanauthcode', {
                                            layout: 'management',
                                            title: "Admin",
                                            authcode: pass,
                                            users: records3,
                                            success: true,
                                            isLoggedIn: req.session.isLoggedIn,
                                            canAdmin: req.session.canAdmin,
                                            user: req.session.user
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        Badgescan.update({id: records[0].id}, {authcode: pass}).exec(function(err2, records) {
                            if(err2) {
                                console.log(err2);
                                return res.serverError(err2);
                            } else {
                                User.find({isDeleted: false}).sort('lastName ASC').sort('firstName ASC').exec(function(err3, records3) {
                                    if(err3) {
                                        console.log(err3);
                                        return res.serverError(err3);
                                    } else {
                                        return res.view('badgescanauthcode', {
                                            layout: 'management',
                                            title: "Admin",
                                            authcode: pass,
                                            users: records3,
                                            success: true,
                                            isLoggedIn: req.session.isLoggedIn,
                                            canAdmin: req.session.canAdmin,
                                            user: req.session.user
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
    },
    viewBadges: function(req, res) {
        User.find({id: req.body.users}).sort('lastName ASC').sort('firstName ASC').populate('position').exec(function(err, records) {
            if(err) {
                console.log(err);
                return res.serverError(err);
            } else {
                return res.view('badges', {
                    layout: 'bare',
                    title: "Admin",
                    users: records,
                    isLoggedIn: req.session.isLoggedIn,
                    canAdmin: req.session.canAdmin,
                    user: req.session.user
                });
            }
        });
    },
}