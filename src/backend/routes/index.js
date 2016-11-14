var express = require('express');
var router = express.Router();
var search = require('../public/components/search');
var _ = require('underscore');

router.get('/', function(req, res) {
    res.send(req.cookies);
});

module.exports = router;
