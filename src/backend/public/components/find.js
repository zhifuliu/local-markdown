var _ = require('underscore');
var hostConfig = require('./config.json');
var mongodb = require('mongodb');
var server = new mongodb.Server(hostConfig.host, hostConfig.port, {
    auto_reconnect: true
});

module.exports = function(searchData, callback, dbConfig) {
    if (_.isUndefined(dbConfig)) {
        dbConfig = {
            database: 'collect',
            collection: 'user'
        };
    }
    if (_.isUndefined(dbConfig.database)) {
        dbConfig.database = 'collect';
    }
    if (_.isUndefined(dbConfig.collection)) {
        dbConfig.collection = 'user';
    }

    var db = new mongodb.Db(dbConfig.database, server, {
        safe: true
    });
    // 连接 db
    db.open(function(err, db) {
        if (!err) {
            db.createCollection(dbConfig.collection, {
                safe: true
            }, function(err, collection) {
                if (err) {
                    callback({
                        errCode: -1,
                        errMsg: 'connect collection error'
                    });
                } else {
                    collection.find(searchData.find).skip(searchData.skip).limit(searchData.limit).sort(searchData.sort).toArray(function(err, result) {
                        if (err) {
                            callback({
                                errCode: -1,
                                errMsg: 'search error'
                            });
                        } else {
                            if (result.length === 0) {
                                callback({
                                    errCode: 1,
                                    errMsg: 'no data'
                                });
                            } else {
                                callback({
                                    errCode: 0,
                                    errMsg: result
                                });
                            }
                        }
                    });
                }
            });
        } else {
            callback({
                errCode: -1,
                errMsg: 'open error'
            });
        }
    });
    //console.log('调用 callbakc 后，还会不会执行到这个地方，如果会，那么释放连接，应该有这个必要');
};