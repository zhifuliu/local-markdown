var express = require('express');
var fs = require('fs');
var Git = require('nodegit');
var router = express.Router();
var _ = require('underscore');

var userBase = require('../components/userBase');
var productBase = require('../components/productBase');
var fileOperation = require('../components/fileOperation');

router.post('/', function(req, res) {
    req.body.mdPath = req.body.mdPath !== undefined ? req.body.mdPath : '';
    var remarks = require('../../commitRemarks.json');
    var defaultRemark = remarks.remarks[Math.floor(Math.random()*10000)%remarks.remarks.length];
    if (req.body.commitRemark !== undefined) {
        req.body.commitRemark = req.session.userMsg.nickname + '”修改了“' + req.body.mdFileName + '”，并说了句:' + req.body.commitRemark;
    } else {
        if (Math.random()*100%2 > 1) {
            req.body.commitRemark = req.session.userMsg.nickname + '”修改了“' + req.body.mdFileName + '”，并说了句:' + defaultRemark + '(此remark为随机值)';
        } else {
            req.body.commitRemark = '傻逼“' + req.session.userMsg.nickname + '”修改了“' + req.body.mdFileName + '”，而且他很无语，并不想说什么！！';
        }
    }
    if (!_.isUndefined(req.body.projectName) && !_.isUndefined(req.body.projectUrl) && !_.isUndefined(req.body.mdFileName) && !_.isUndefined(req.body.newData)) {
        try {
            // fileOperation.writeFile(req.body.projectUrl + '/' + (req.body.mdPath.length == 0 ? '' : (req.body.mdPath + '/')) + req.body.mdFileName, req.body.newData);
            fs.writeFileSync(req.body.projectUrl + '/' + (req.body.mdPath.length === 0 ? '' : (req.body.mdPath + '/')) + req.body.mdFileName, req.body.newData, 'utf-8', function(err, data) {});
            require('simple-git')(req.body.projectUrl)
                .add(req.body.projectUrl + '/' + (req.body.mdPath.length === 0 ? '' : (req.body.mdPath + '/')) + req.body.mdFileName)
                .commit(req.body.commitRemark)
                .then(function(data) {});
            res.send({
                errCode: 1,
                errMsg: 'success'
            });
        } catch (err) {
            console.log(err);
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
