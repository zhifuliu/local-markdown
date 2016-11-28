var _ = require('underscore');
var list = require('../../projectList.json').list;
var fileOperation = require('./fileOperation');

function haveProject(name, url) {
    var result = {};
    var nameFilter = _.find(list, function(item) {
        return item.name == name;
    });
    var urlFilter = _.find(list, function(item) {
        return item.url == url;
    });
    if (urlFilter !== undefined && nameFilter !== undefined) {
        result = {
            errCode: -1,
            errMsg: '项目已经存在'
        };
    } else if (urlFilter !== undefined && nameFilter === undefined) {
        result = {
            errCode: -1,
            errMsg: '项目url已经添加，项目名：' + urlFilter.name
        };
    } else if (urlFilter === undefined && nameFilter !== undefined) {
        result = {
            errCode: -1,
            errMsg: '项目 name 已经添加'
        };
    } else {
        result = {
            errCode: 0,
            errMsg: '项目不存在'
        };
    }
    return result;
}
function getProjectList() {
    return list;
}
function addProject(name, url) {
    var result = {};
    result = haveProject(name, url);
    if (result.errCode != -1) {
        list.push({
            name: name,
            url: url,
            lastUpdateTime: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
        });
        fileOperation.writeJsonFile('./projectList.json', JSON.stringify({list: list}));
        return {
            errCode: 1,
            errMsg: 'add project success'
        };
    } else {
        return result;
    }
}
function deleteProject(name, url) {
    var result = {};
    result = haveProject(name, url);
    if (result.errCode != -1) {
        return {
            errCode: -1,
            errMsg: 'project not exist'
        };
    } else {
        list = _.filter(list, function(item) {return item.name != name && item.url != url;});
        fileOperation.writeJsonFile('./projectList.json', JSON.stringify({list: list}));
        return {
            errCode: 1,
            errMsg: 'delete project success'
        };
    }
}

exports.getProjectList = getProjectList;
exports.addProject = addProject;
exports.deleteProject = deleteProject;
