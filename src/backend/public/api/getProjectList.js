var express = require('express');
var router = express.Router();
var _ = require('underscore');
var productBase = require('../components/productBase');
var userBase = require('../components/userBase');

router.post('/', function(req, res) {
    res.send(productBase.getProjectList());
});

module.exports = router;
