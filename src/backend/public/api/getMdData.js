var express = require('express');
var fs = require('fs');
var router = express.Router();
var _ = require('underscore');
var userBase = require('../components/userBase');
var productBase = require('../components/productBase');
var fileOperation = require('../components/fileOperation');

router.post('/', function(req, res) {
    req.body.mdPath = req.body.mdPath != undefined ? req.body.mdPath : '';
    if (!_.isUndefined(req.body.projectName) && !_.isUndefined(req.body.projectUrl) && !_.isUndefined(req.body.mdFileName)) {
        try {
            res.send({
                errCode: 1,
                errMsg: 'success',
                data: fs.readFileSync(req.body.projectUrl + '/' + (req.body.mdPath.length == 0 ? '' : (req.body.mdPath + '/')) + req.body.mdFileName, 'utf-8')
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
