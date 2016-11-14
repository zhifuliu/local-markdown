var express = require('express');
var router = express.Router();
var _ = require('underscore');
var find = require('../components/find');
var searchObjAanlyze = require('../components/searchObjAanlyze');

// 类型:1 tag 2 模糊查询。时间、起始位置、记录条数
router.post('/', function(req, res) {
    var type = req.body.type,
        searchValue = req.body.search,
        beginDate = req.body.beginDate,
        endDate = req.body.endDate,
        pageIndex = req.body.pageIndex,
        len = req.body.len;
    if (!_.isUndefined(type) && type.length !== 0 &&
        !_.isUndefined(searchValue) && searchValue.length !== 0) {
        (!_.isUndefined(pageIndex) && pageIndex.length !== 0 && parseInt(pageIndex) > 0) ? pageIndex = parseInt(pageIndex) : pageIndex = 0;
        (!_.isUndefined(len) && len.length !== 0 && parseInt(len) > 0) ? len = parseInt(len) : len = 0;
        (!_.isUndefined(beginDate) && beginDate.length !== 0 && parseInt(beginDate) > 0) ? beginDate = parseInt(beginDate) : beginDate = 0;
        (!_.isUndefined(endDate) && endDate.length !== 0 && parseInt(endDate) > 0) ? endDate = parseInt(endDate) : endDate = 99991231;

        if (type == 'tag') {
            var tags = searchValue.split(';');
            var oneLevelTag = tags[0];
            var twoLevelTag = tags[1];
            if (_.isUndefined(oneLevelTag) || _.isNull(oneLevelTag) || _.isEmpty(oneLevelTag)) {
                res.send({
                    errCode: 1,
                    errMsg: 'tag search, tag string params err'
                });
            } else {
                var searchObject = {};
                (_.isUndefined(twoLevelTag) || _.isNull(twoLevelTag) || _.isEmpty(twoLevelTag)) ? searchObject = {user: req.session.userMsg.user,oneLevelTag: oneLevelTag} : searchObject = {user: req.session.userMsg.user,oneLevelTag: oneLevelTag,twoLevelTag: twoLevelTag};

                if (oneLevelTag == '全部') {
                    find({
                        find: {
                            user: req.session.userMsg.user
                        },
                        skip: pageIndex * len,
                        limit: len,
                        sort: {
                            data: -1,
                            time: -1
                        }
                    }, function(data) {
                        res.send(data);
                    }, {
                        collection: 'collects'
                    });
                } else {
                    find({
                        find: searchObject,
                        skip: pageIndex * len,
                        limit: len,
                        sort: {
                            data: -1,
                            time: -1
                        }
                    }, function(data) {
                        res.send(data);
                    }, {
                        collection: 'collects'
                    });
                }
            }
        } else if (type == 'highLevel'){
            var oneLevelSearchObj = searchValue.split(' ');
            var urtObj = oneLevelSearchObj[oneLevelSearchObj.length-1];
            (urtObj.indexOf('url:') != -1 || urtObj.indexOf('bz:') != -1 || urtObj.indexOf('bt:') != -1) ? oneLevelSearchObj.splice(oneLevelSearchObj.length - 1, 1) : urtObj = '';

            var statement = {
                $and: [{
                    user: req.session.userMsg.user
                }, {
                    date: {
                        $gte: beginDate
                    }
                }, {
                    date: {
                        $lte: endDate
                    }
                }]
            };
            if (oneLevelSearchObj.length > 0) {
                var tagSearchObj = {};
                _.each(oneLevelSearchObj, item => {
                    tagSearchObj[item.split(':')[0]] = item.split(':')[1];
                });
                if (!_.isUndefined(tagSearchObj.t1)) {
                    statement.$and.splice(1, 0, {
                        oneLevelTag: tagSearchObj.t1
                    });
                    if (!_.isUndefined(tagSearchObj.t2)) {
                        statement.$and.splice(2, 0, {
                            twoLevelTag: tagSearchObj.t2
                        });
                    }
                } else if (!_.isUndefined(tagSearchObj.t2)) {
                    statement.$and.splice(1, 0, {
                        twoLevelTag: tagSearchObj.t2
                    });
                } else if (!_.isUndefined(tagSearchObj.t)) {
                    statement.$and.splice(1, 0, {
                        $or: [
                            {
                                oneLevelTag: tagSearchObj.t
                            }, {
                                twoLevelTag: tagSearchObj.t
                            }
                        ]
                    });
                } else {}
            }

            // console.log(searchObjAanlyze.getSearchObj(urtObj));
            // console.log(searchObjAanlyze.getSearchObj(urtObj).resultMsg);
            // console.log(statement);
            // console.log(statement.$and);
            // console.log(statement.$and.length);
            // console.log(searchObjAanlyze.getSearchObj(urtObj).resultMsg);
            statement.$and[statement.$and.length] = searchObjAanlyze.getSearchObj(urtObj).resultMsg;
            console.log(statement);
            // console.log(statement.$and);
            // console.log(statement.$and.length);

            find({
                find: statement,
                skip: pageIndex * len,
                limit: len,
                sort: {
                    data: -1,
                    time: -1
                }
            }, function(data) {
                res.send({
                    errCode: 0,
                    errMsg: data.errMsg
                });
            }, {
                collection: 'collects'
            });
        } else if (type == 'search') {
            console.log(searchValue);
            var reg = '/';
            _.each(searchValue.split(' '), function(v) {
                reg += '(' + v + ')|';
            });
            reg = reg.substring(0, reg.length - 1) + '/i';
            console.log(reg);
            var statement = {
                $and: [{
                    user: req.session.userMsg.user
                }, {
                    date: {
                        $gte: beginDate
                    }
                }, {
                    date: {
                        $lte: endDate
                    }
                }, {
                    $or: [{
                        title: eval(reg)
                    }, {
                        remark: eval(reg)
                    }, {
                        oneLevelTag: searchValue
                    }, {
                        twoLevelTag: searchValue
                    }]
                }]
            };
            console.log(statement);
            find({
                find: statement,
                skip: pageIndex * len,
                limit: len,
                sort: {
                    data: -1,
                    time: -1
                }
            }, function(data) {
                res.send({
                    errCode: 0,
                    errMsg: data.errMsg
                });
            }, {
                collection: 'collects'
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
