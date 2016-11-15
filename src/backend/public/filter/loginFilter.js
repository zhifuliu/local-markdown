var _ = require('underscore');

module.exports = function(req, res, next) {
    if (_.isUndefined(req.session.userMsg)) {
        res.send({
            errCode: -1,
            eddMsg: 'no login'
        });
    } else {
        next();
    }
};
