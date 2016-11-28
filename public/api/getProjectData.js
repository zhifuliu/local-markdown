var express = require('express');
var fs = require('fs');
var router = express.Router();
var _ = require('underscore');
var userBase = require('../components/userBase');
var productBase = require('../components/productBase');
var fileOperation = require('../components/fileOperation');

router.post('/', function(req, res) {
    if (!_.isUndefined(req.body.name) && !_.isUndefined(req.body.url)) {
        // JSON.parse(fs.readFileSync('./public/data/' + req.body.name + '.json', 'utf-8'))
        // require('../data/' + req.body.name + '.json')
        try {
            res.send({
                errCode: 1,
                errMsg: 'success',
                data: JSON.parse(fs.readFileSync('./public/data/' + req.body.name + '.json', 'utf-8'))
            });
        } catch(err) {
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
