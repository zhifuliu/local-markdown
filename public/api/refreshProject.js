var express = require('express');
var router = express.Router();
var _ = require('underscore');
var userBase = require('../components/userBase');
var productBase = require('../components/productBase');
var fileOperation = require('../components/fileOperation');

router.post('/', function(req, res) {
    if (!_.isUndefined(req.body.name) && !_.isUndefined(req.body.url)) {
        try {
            fileOperation.traverseDir(req.body.url, req.body.name);
            res.send({
                errCode: 1,
                errMsg: 'success'
            });
        } catch (err) {
            res.send({
                errCode: -1,
                errMsg: err
            });
        }
    } else {
        res.send({
            errCode: -1,
            errMsg: 'params err'
        });
    }
});

module.exports = router;
