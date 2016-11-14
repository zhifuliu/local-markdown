var express = require('express');
var router = express.Router();
var _ = require('underscore');
var moment = require('moment');
var search = require('../components/search');
var insert = require('../components/insert');

// user、url、title、remark、tag、date、time
router.post('/', function(req, res) {
  console.log(req.body);
    var user = req.body.user,
        pass = req.body.pass,
        url = req.body.url,
        title = req.body.title,
        remark = req.body.remark,
        oneLevelTag = req.body.oneLevel,
        twoLevelTag = req.body.twoLevel,
        tag = req.body.tag;
    if (!_.isUndefined(user) && user.length !== 0 &&
        !_.isUndefined(pass) && pass.length !== 0 &&
        !_.isUndefined(url) && url.length !== 0 &&
        !_.isUndefined(title) && title.length !== 0 &&
        !_.isUndefined(oneLevelTag) && oneLevelTag.length !== 0 &&
        !_.isUndefined(twoLevelTag) && twoLevelTag.length !== 0) {
          search({
              pass: pass,
              $or: [{
                  _id: user
              }, {
                  phone: user
              }, {
                  email: user
              }]
          }, function(data) {
              if (data.errCode === 0) {
                  userMsg = {};
                  userMsg.user = data.errMsg[0]._id;
                  userMsg.nickname = data.errMsg[0].nickname;
                  userMsg.registerDate = data.errMsg[0].registerDate;
                  userMsg.registerTime = data.errMsg[0].registerTime;
                  userMsg.header = data.errMsg[0].header;
                  userMsg.tags = data.errMsg[0].tags;

                  var currentOneLevelTag = _.find(userMsg.tags.oneLevelTags, item => {
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
                      var now = moment();
                      remark = (!_.isUndefined(remark) && remark.length !== 0) ? remark : '';
                      var collect = {
                          user: user,
                          url: url,
                          title: title,
                          oneLevelTag: oneLevelTag,
                          twoLevelTag: twoLevelTag,
                          remark: remark,
                          date: parseInt(now.format('YYYYMMDD')),
                          time: parseInt(now.format('HHmmss'))
                      };
                      search({
                          user: user,
                          url: url
                      }, function(data) {
                          if (data.errCode == 1) {
                              insert(collect, function(data) {
                                  if (data.errCode === 0 && !_.isUndefined(data.errMsg.result) && data.errMsg.result.ok == 1 && data.errMsg.result.n == 1) {
                                      res.send({
                                          errCode: 0,
                                          errMsg: 'add success'
                                      });
                                  } else {
                                      res.send(data);
                                  }
                              }, {
                                  collection: 'collects'
                              });
                          } else if (data.errCode === 0) {
                              res.send({
                                  errCode: -2,
                                  errMsg: 'havn'
                              });
                          } else {
                              res.send(data);
                          }
                      }, {
                          collection: 'collects'
                      });
                  }
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
