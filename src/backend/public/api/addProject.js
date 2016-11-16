var express = require('express');
var router = express.Router();
var _ = require('underscore');
var productBase = require('../components/productBase');
var userBase = require('../components/userBase');

router.post('/', function(req, res) {
    if (!_.isUndefined(req.body.name) && !_.isUndefined(req.body.url)) {
        res.send(productBase.addProject(req.body.name, req.body.url));
    } else {
        res.send({
            errCode: -1,
            errMsg: 'params err'
        });
    }
});

module.exports = router;
