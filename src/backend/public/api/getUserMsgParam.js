var express = require('express');
var router = express.Router();
var _ = require('underscore');
var search = require('../components/search');
var insert = require('../components/insert');

router.post('/', function(req, res) {
    if (!_.isUndefined(req.body.user) && !_.isUndefined(req.body.pass)) {
        search({
            pass: req.body.pass,
            $or: [{
                _id: req.body.user
            }, {
                phone: req.body.user
            }, {
                email: req.body.user
            }]
        }, function(data) {
            if (data.errCode === 0) {
                userMsg = {};
                userMsg.user = data.errMsg[0]._id;
                userMsg.nickname = data.errMsg[0].nickname;
                userMsg.registerDate = data.errMsg[0].registerDate;
                userMsg.registerTime = data.errMsg[0].registerTime;
                userMsg.header = data.errMsg[0].header;
                userMsg.tags = data.errMsg[0].tags;

                res.send({
                    errCode: 0,
                    errMsg: userMsg
                });
            } else {
                res.send(data);
            }
        });
    } else {
        res.send({
            errCode: 1,
            errMsg: 'params err'
        });
    }
});

module.exports = router;
