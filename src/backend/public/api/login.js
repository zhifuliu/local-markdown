var express = require('express');
var router = express.Router();
var _ = require('underscore');

router.post('/', function(req, res) {
    if (!_.isUndefined(req.body.user) && !_.isUndefined(req.body.pass)) {
        console.log(req.body);
    } else {
        res.send({
            errCode: 1,
            errMsg: 'params err'
        });
    }
});

module.exports = router;
