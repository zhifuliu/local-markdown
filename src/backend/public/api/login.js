var express = require('express');
var router = express.Router();
var _ = require('underscore');
var search = require('../components/search');
var insert = require('../components/insert');

router.post('/', function(req, res) {
    if (!_.isUndefined(req.body.user) && !_.isUndefined(req.body.pass)) {
        search({
            pass: req.body.pass,
            $or: [{
                _id: req.body.user
            }, {
                phone: req.body.user
            }, {
                email: req.body.user
            }]
        }, function(data) {
            if (data.errCode === 0) {
                req.session.userMsg = {};
                req.session.userMsg.user = data.errMsg[0]._id;
                req.session.userMsg.nickname = data.errMsg[0].nickname;
                req.session.userMsg.registerDate = data.errMsg[0].registerDate;
                req.session.userMsg.registerTime = data.errMsg[0].registerTime;
                req.session.userMsg.header = data.errMsg[0].header;
                req.session.userMsg.tags = data.errMsg[0].tags;

                var encrypter = new(require('encrypter'))(data.errMsg[0]._id);
                var cookieValue = encrypter.encrypt(data.errMsg[0]._id);
                res.cookie('userMsg', cookieValue);
                search({
                    _id: data.errMsg[0]._id
                }, function(data) {
                    if (data.errCode == 1) {
                        // update,加密结果都一样，为什么要 update，所以只要判断没有数据的时候插入数据就可以
                        insert({
                            _id: req.session.userMsg.user,
                            cookie: cookieValue
                        }, function() {}, {
                            collection: 'cookie'
                        });
                    }
                }, {
                    collection: 'cookie'
                });
                res.send({
                    errCode: 0,
                    errMsg: 'login success'
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
});

module.exports = router;
