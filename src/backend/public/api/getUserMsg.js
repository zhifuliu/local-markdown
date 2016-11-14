var express = require('express');
var router = express.Router();
var _ = require('underscore');
var search = require('../components/search');
var remove = require('../components/remove');

router.post('/', function(req, res) {
    res.send({
        errCode: 0,
        errMsg: req.session.userMsg
    });
});

module.exports = router;
