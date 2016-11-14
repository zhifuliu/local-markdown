var express = require('express');
var router = express.Router();
var insert = require('../public/components/insert');

router.get('/', function(req, res) {
    insert({
        _id: '491836641',
        cookie: 'insert'
    }, function(data) {
        console.log(data);
    }, {
        collection: 'cookie'
    });
    //res.send('mongoDB page handle');

    // 下面这个实例的网址： http://www.cnblogs.com/whoamme/p/3467374.html
    var mongodb = require('mongodb');
    var server = new mongodb.Server('localhost', 27017, {
        auto_reconnect: true
    });
    var db = new mongodb.Db('collect', server, {
        safe: true
    });
    // 连接 db
    db.open(function(err, db) {
        if (!err) {
            console.log('connect db');
            // 连接 collection（可以认为是连接mysql的table）

            // 第一种连接方式
            /*db.collection('collect', {safe: true}, function(err, collection) {
                if (err){console.log(err)};
            });*/

            // 第二种连接方式,连接到集合，相当于 mysql 中的 table
            db.createCollection('cookie', {
                safe: true
            }, function(err, collection) {
                if (err) {
                    console.log(err);
                } else {
                    // 新增数据: 成功
                    /*var tmp1 = {
                        _id: '491836641',
                        pass: '1',
                        nickname: '睡不着小姐',
                        registerDate: 20160229,
                        registerTime: 164200,
                        email: '491836641@qq.com',
                        phone: '15906656221',
                        "header" : "./header.img",
                        "tags" : [{"value" : "文章"}, {"value" : "图片"}, {"value" : "视频"}, {"value" : "语句"}]
                    };
                    collection.insert(tmp1, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('err:' + err.message);
                        } else {
                            console.log(result)
                        }
                    });*/

                    /*collection.insert({_id: '1203228', cookie: 'zhifu'}, {safe: true}, function(err, result) {
                        if (err) {
                            console.log('err:' + err.message);
                        } else {
                            console.log(result.result.ok);
                            console.log(result)
                        }
                    });*/


                    // 修改数据: collection.update({}, {}, function(err, result){});
                    // 删除数据: collection.remove({}, {}, function(err, result){});
                    // 查询数据: collection.find({}).toArray(function(err, result){});
                    /*collection.find().toArray(function(err, result) {
                        if (err) {
                            console.log('err:' + err.message);
                            res.send(err.message);
                        } else {
                            console.log(result);
                            res.send(result);
                        }
                    });*/
                }
                // 删除集合(table): db.dropCollection('collectionName', {}, function(err, result){})
                // 删除数据库: db.dropDatabase()
            });
        } else {
            console.error(err.message);
            console.log('db open error');
            console.log('err:' + err.message);
        }
    });

    /*
     var mongodbClient = require('mongodb').MongoClient;
    var url = 'mongodb://localhost:27017/col';
    mongodbClient.connect(url, function(err, db) {
        if (err) {
            console.log(err);
            db.close();
            return ;
        }
        console.log('Connected correctly to server');
        db.collection('col').find().toArray(function(err, result) {
            if (err) {
                throw err;
            }
            console.log(result);
        });
    });*/
    res.send('db');
});

module.exports = router;
