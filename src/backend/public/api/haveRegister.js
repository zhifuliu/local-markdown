var express = require('express');
var router = express.Router();
var _ = require('underscore');
var search = require('../components/search');

router.post('/', function(req, res) {
    if (!_.isUndefined(req.body.account)) {
        var condition = {};
        if (req.body.type == 'email') {
            condition.email = req.body.account;
        } else if (req.body.type == 'phone') {
            condition.phone = req.body.account;
        } else {
            condition._id = req.body.account;
        }
        search(condition, function(data) {
            if (data.errCode === 0) {
                res.send({
                    errCode: 0,
                    errMsg: 'have'
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
