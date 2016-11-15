var express = require('express');
var router = express.Router();
var _ = require('underscore');
var userBase = require('../components/userBase');

router.post('/', function(req, res) {
    res.send({
        errCode: 0,
        errMsg: 'success',
        data: req.session.userMsg
    });
});

module.exports = router;
