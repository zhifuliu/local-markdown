var express = require('express');
var router = express.Router();
var _ = require('underscore');
var search = require('../components/search');
var remove = require('../components/remove');
var ObjectID = require('mongodb').ObjectID;

router.post('/', function(req, res) {
    var collectId = req.body.collectId;
    if (!_.isUndefined(req.body.collectId)) {
        search({
            _id: ObjectID(collectId),
            user: req.session.userMsg.user
        }, function(data) {
            if (data.errCode === 0) {
                remove({
                    _id: ObjectID(collectId),
                    user: req.session.userMsg.user
                }, function(data) {
                    if (data.errCode === 0 && data.errMsg.result.ok == 1) {
                        res.send({
                            errCode: 0,
                            errMsg: 'delete success'
                        });
                    }
                }, {
                    collection: 'collects'
                });
            } else {
                res.send({
                    errCode: -2,
                    errMsg: 'no data'
                });
            }
        }, {
            collection: 'collects'
        });
    } else {
        res.send({
            errCode: 1,
            errMsg: 'params err'
        });
    }
});

module.exports = router;
