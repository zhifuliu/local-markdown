var express = require('express');
var router = express.Router();
var _ = require('underscore');
var search = require('../components/search');
var remove = require('../components/remove');

router.post('/', function(req, res) {
    search({
        _id: req.session.userMsg.user
    }, function(data) {
        if (data.errCode === 0) {
            remove({
                _id: req.session.userMsg.user
            }, function(data) {
                if (data.errCode === 0 && data.errMsg.result.ok == 1) {
                    req.session.userMsg = undefined;
                    res.cookie('userMsg', undefined);
                    res.send({
                        errCode: 0,
                        errMsg: 'logout success'
                    });
                }
            }, {
                collection: 'cookie'
            });
        } else {
            req.session.userMsg = undefined;
            res.cookie('userMsg', undefined);
            res.send({
                errCode: 0,
                errMsg: 'logout success'
            });
        }
    }, {
        collection: 'cookie'
    });
});

module.exports = router;
