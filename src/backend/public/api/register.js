var express = require('express');
var router = express.Router();
var _ = require('underscore');
var moment = require('moment');
var search = require('../components/search');
var insert = require('../components/insert');

// 帐号、密码、昵称、邮箱手机号
router.post('/', function(req, res) {
    var user = req.body.user,
        pass = req.body.pass,
        nickname = req.body.nickname,
        email = req.body.email,
        phone = req.body.phone;
    if (!_.isUndefined(user) && user.length !== 0 &&
        !_.isUndefined(pass) && pass.length !== 0 &&
        !_.isUndefined(nickname) && nickname.length !== 0 &&
        !_.isUndefined(email) && email.length !== 0 &&
        !_.isUndefined(phone) && phone.length !== 0) {
        var now = moment();
        var userMsg = {
            _id: user,
            pass: pass,
            nickname: nickname,
            registerDate: parseInt(now.format('YYYYMDD')),
            registerTime: parseInt(now.format('HHmm')),
            email: email,
            phone: phone,
            header: '',
            tags: {}
        };
        insert(userMsg, function(data) {
            if (data.errCode === 0 && !_.isUndefined(data.errMsg.result) && data.errMsg.result.ok == 1 && data.errMsg.result.n == 1) {

                req.session.userMsg = {};
                req.session.userMsg.user = userMsg._id;
                req.session.userMsg.nickname = userMsg.nickname;
                req.session.userMsg.registerDate = userMsg.registerDate;
                req.session.userMsg.registerTime = userMsg.registerTime;
                req.session.userMsg.header = userMsg.header;
                req.session.userMsg.tags = userMsg.tags;

                var encrypter = new(require('encrypter'))(userMsg._id);
                var cookieValue = encrypter.encrypt(userMsg._id);
                res.cookie('userMsg', cookieValue);
                search({
                    _id: userMsg._id
                }, function(data) {
                    if (data.errCode == 1) {
                        // update,加密结果都一样，为什么要 update，所以只要判断没有数据的时候插入数据就可以
                        insert({
                            _id: userMsg._id,
                            cookie: cookieValue
                        }, function() {}, {
                            collection: 'cookie'
                        });
                        res.send({
                            errCode: 0,
                            errMsg: 'register success'
                        });
                    } else {
                        resres.send({
                            errCode: 1,
                            errMsg: 'params err'
                        });
                    }
                }, {
                    collection: 'cookie'
                });
            } else {
                resres.send(data);
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
