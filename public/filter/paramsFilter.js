var _ = require('underscore');

module.exports = function(req, res, next) {
    if (!_.isEmpty(req.params)) {
        console.log('req.params:');
        _.each(_.keys(req.params), function(key) {
            console.log(key + ' : ' + req.params[key]);
            req.body[key] = req.params[key];
        });
    }
    if (!_.isEmpty(req.query)) {
        console.log('req.query:');
        _.each(_.keys(req.query), function(key) {
            console.log(key + ' : ' + req.query[key]);
            req.body[key] = req.query[key];
        });
    }
    next();
};
