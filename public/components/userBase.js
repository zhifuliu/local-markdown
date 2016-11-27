var _ = require('underscore');
var users = require('../../user.json').users;

function haveUser(userId) {
    return _.find(users, function(user) {
        return user.id == userId;
    });
}

function login (userId, pass) {
    var result = {};
    if (haveUser(userId) !== undefined) {
        var temp = _.find(users, function(user) {
           return user.id == userId && user.pass == pass;
       });
       if (temp !== undefined) {
           result = {
               errCode: 1,
               errMsg: '登录成功',
               data: {
                  id: temp.id,
                  nickname: temp.nickname
               }
           };
       } else {
           result = {
               errCode: -1,
               errMsg: '密码错误'
           };
       }
    } else {
        result = {
            errCode: -1,
            errMsg: '用户不存在'
        };
    }
    return result;
}

function register(userId, pass, nickname) {
    var result = {};
    if (haveUser(userId) !== undefined) {
        result = {
            errCode: -1,
            errMsg: '用户已存在'
        };
    } else {
        result = {
            errCode: 1,
            errMsg: 'register success'
        };
    }
    return result;
}

function getUserMsg(userId) {
    var userMsg = haveUser(userId);
    if (userMsg !== undefined) {
        return {
            errCode: -1,
            errMsg: '用户已存在'
        };
    } else {
        return userMsg;
    }
}

exports.getUserMsg = getUserMsg;
exports.login = login;
exports.register = register;
exports.getUserMsg = getUserMsg;
