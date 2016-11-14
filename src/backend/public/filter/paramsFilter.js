var _ = require('underscore');

module.exports = function(req, res, next) {
    if (!_.isEmpty(req.params)) {
        _.each(_.keys(req.params), function(key) {
            req.body[key] = req.params[key];
        });
    }
    if (!_.isEmpty(req.query)) {
        _.each(_.keys(req.query), function(key) {
            req.body[key] = req.query[key];
        });
    }
    next();
};
