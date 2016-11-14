var express = require('express');
var router = express.Router();
var _ = require('underscore');

router.post('/', function(req, res) {
    if (_.isUndefined(req.session.userMsg)) {
        if (_.isUndefined(req.cookies.userMsg) || req.cookies.userMsg == 'undefined') {
            res.send({
                errCode: 0,
                eddMsg: 'no login'
            });
        } else {
            req.session.userMsg = undefined;
            res.cookie('userMsg', undefined);
            res.send({
                errCode: 1,
                errMsg: 'logout success'
            });
        }
    } else {
        res.send({
            errCode: 0,
            eddMsg: 'no login'
        });
    }
});

module.exports = router;
