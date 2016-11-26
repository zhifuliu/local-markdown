var express = require('express');
var router = express.Router();
var _ = require('underscore');
var userBase = require('../components/userBase');

router.post('/', function(req, res) {
    if (!_.isUndefined(req.body.user) && !_.isUndefined(req.body.pass)) {
        var result = userBase.login(req.body.user, req.body.pass);
        if (result.errCode == 1) {
            req.session.userMsg = {};
            req.session.userMsg.user = result.data.id;
            req.session.userMsg.nickname = result.data.nickname;
            res.send(result);
        } else {
            res.send(result);
        }
    } else {
        res.send({
            errCode: -1,
            errMsg: 'params err'
        });
    }
});

module.exports = router;
