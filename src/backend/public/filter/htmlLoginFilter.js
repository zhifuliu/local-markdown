var _ = require('underscore');
var search = require('../components/search');

module.exports = function(req, res, next) {
    if (_.isUndefined(req.session.userMsg)) {
        if (_.isUndefined(req.cookies.userMsg) || req.cookies.userMsg == 'undefined') {
            //res.redirect('../pages/login-page/login.html');
        } else {
            search({
                cookie: req.cookies.userMsg
            }, function(data) {
                if (data.errCode === 0) {
                    search({
                        _id: data.errMsg[0]._id
                    }, function(data) {
                        req.session.userMsg = {};
                        req.session.userMsg.user = data.errMsg[0]._id;
                        req.session.userMsg.nickname = data.errMsg[0].nickname;
                        req.session.userMsg.registerDate = data.errMsg[0].registerDate;
                        req.session.userMsg.registerTime = data.errMsg[0].registerTime;
                        req.session.userMsg.tags = data.errMsg[0].tags;
                        next();
                    });
                } else {
                    //res.redirect('../pages/login-page/login.html');
                }
            }, {
                collection: 'cookie'
            });
        }
    } else {
        next();
    }
};
