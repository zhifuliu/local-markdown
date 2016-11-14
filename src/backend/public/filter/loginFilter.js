var _ = require('underscore');

module.exports = function(req, res, next) {
    if (_.isUndefined(req.session.userMsg)) {
        if (_.isUndefined(req.cookies.userMsg) || req.cookies.userMsg == 'undefined') {
            res.send({
                errCode: -1,
                eddMsg: 'no login'
            });
        } else {
            res.send({
                errCode: 1,
                eddMsg: 'login'
            });
        }
    } else {
        next();
    }
};
