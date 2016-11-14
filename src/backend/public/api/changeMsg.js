var express = require('express');
var router = express.Router();
var _ = require('underscore');
var update = require('../components/update');

// 参数: 类型、新值、密码
// 可修改: 昵称、密码
router.post('/', function(req, res) {
    var type = req.body.type,
        newValue = req.body.newValue,
        pass = req.body.pass;
    if (!_.isUndefined(type) && !_.isUndefined(newValue)) {
        if (type == 'pass') {
            if (_.isUndefined(pass)) {
                res.send({
                    errCode: 1,
                    errMsg: 'params err'
                });
            } else {
                update({
                    _id: req.session.userMsg.user,
                    pass: pass
                }, {
                    $set: {
                        pass: newValue
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
                            errMsg: 'pass error'
                        });
                    }
                });
            }
        } else if (type == 'nick') {
            update({
                _id: req.session.userMsg.user
            }, {
                $set: {
                    nickname: newValue
                }
            }, function(data) {
                if (data.errCode === 0 && data.errMsg.result.ok == 1) {
                    req.session.userMsg.nickname = newValue;
                    res.send({
                        errCode: 0,
                        errMsg: 'change success'
                    });
                } else {
                    res.send(data);
                }
            });
        } else if (type == 'tags') {
            update({
                _id: req.session.userMsg.user
            }, {
                $set: {
                    tags: newValue
                }
            }, function(data) {
                if (data.errCode === 0 && data.errMsg.result.ok == 1) {
                    req.session.userMsg.tags = newValue;
                    res.send({
                        errCode: 0,
                        errMsg: 'change success'
                    });
                } else {
                    res.send(data);
                }
            });
        } else {
            res.send({
                errCode: 1,
                errMsg: 'params err'
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
