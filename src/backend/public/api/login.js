var express = require('express');
var router = express.Router();
var _ = require('underscore');
var userBase = require('../components/userbase');

router.post('/', function(req, res) {
    if (!_.isUndefined(req.body.user) && !_.isUndefined(req.body.pass)) {
        res.send(userBase.login(req.body.user, req.body.pass));
    } else {
        res.send({
            errCode: -1,
            errMsg: 'params err'
        });
    }
});

module.exports = router;
