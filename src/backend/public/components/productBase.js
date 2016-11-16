var _ = require('underscore');
var list = require('../../projectList.json').list;

function getProjectList() {
    return list;
}

exports.getProjectList = getProjectList;
