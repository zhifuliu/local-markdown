var express = require('express');
var router = express.Router();
var _ = require('underscore');

router.post('/', function(req, res) {
    req.session.userMsg = undefined;
    res.send({
        errCode: 1,
        errMsg: 'logout success'
    });
});

module.exports = router;
