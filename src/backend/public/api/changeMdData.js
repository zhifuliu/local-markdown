var express = require('express');
var fs = require('fs');
var router = express.Router();
var _ = require('underscore');
var userBase = require('../components/userBase');
var productBase = require('../components/productBase');
var fileOperation = require('../components/fileOperation');

router.post('/', function(req, res) {
    req.body.mdPath = req.body.mdPath != undefined ? req.body.mdPath : '';
    req.body.commitRemark = req.body.commitRemark != undefined ? ('傻逼“' + req.session.userMsg.nickname + '”修改了“' + req.body.mdFileName + '”，并说了句:' + req.body.commitRemark) : ('傻逼“' + req.session.userMsg.nickname + '”修改了“' + req.body.mdFileName + '”');
    if (!_.isUndefined(req.body.projectName) && !_.isUndefined(req.body.projectUrl) && !_.isUndefined(req.body.mdFileName) && !_.isUndefined(req.body.newData)) {
        try {
            // fileOperation.writeFile(req.body.projectUrl + '/' + (req.body.mdPath.length == 0 ? '' : (req.body.mdPath + '/')) + req.body.mdFileName, req.body.newData);
            fs.writeFileSync(req.body.projectUrl + '/' + (req.body.mdPath.length == 0 ? '' : (req.body.mdPath + '/')) + req.body.mdFileName, req.body.newData, 'utf-8', function (err, data) {});
            res.send({
                errCode: 1,
                errMsg: 'success'
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
