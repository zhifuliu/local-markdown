var express = require('express');
var router = express.Router();
var _ = require('underscore');
var update = require('../components/update');
var ObjectID = require('mongodb').ObjectID;

// 参数: 类型、新值、密码
// 可修改: 昵称、密码
router.post('/', function(req, res) {
    var id = req.body._id,
        oneLevelTag = req.body.oneLevelTag,
        twoLevelTag = req.body.twoLevelTag,
        remark = req.body.remark;
    if (!_.isUndefined(id)) {
        if (req.body.user == req.session.userMsg.user) {
            var currentOneLevelTag = _.find(req.session.userMsg.tags.oneLevelTags, item => {
                return item.name == oneLevelTag;
            });
            if (_.isUndefined(currentOneLevelTag) || _.isNull(currentOneLevelTag)) {
                res.send({
                    errCode: 1,
                    errMsg: 'oneLevelTag not exist'
                });
            } else if(currentOneLevelTag.tags.indexOf(twoLevelTag) == -1) {
                res.send({
                    errCode: 1,
                    errMsg: 'twoLevelTag not exist'
                });
            } else {
                update({
                    _id: ObjectID(id)
                }, {
                    $set: {
                        oneLevelTag: oneLevelTag,
                        twoLevelTag: twoLevelTag,
                        remark: remark
                    }
                }, function(data) {
                    if (data.errCode === 0 && data.errMsg.result.ok == 1 && data.errMsg.result.nModified == 1 && data.errMsg.result.n == 1) {
                        res.send({
                            errCode: 0,
                            errMsg: 'change success'
                        });
                    } else {
                        res.send({
                            errCode: -1,
                            errMsg: 'change error'
                        });
                    }
                }, {
                    database: 'collect',
                    collection: 'collects'
                });
            }
        } else {
            res.send({
                errCode: 1,
                errMsg: 'user matching error'
            });
        }
    } else {
        res.send({
            errCode: 1,
            errMsg: 'params err'
        });
    }
});

module.exports = router;
