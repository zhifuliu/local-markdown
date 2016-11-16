var _ = require('underscore');

module.exports = function(req, res, next) {
    if (_.isUndefined(req.session.userMsg)) {
        res.status(401).send({
            errCode: -1,
            eddMsg: 'no login'
        });
    } else {
        next();
    }
};
