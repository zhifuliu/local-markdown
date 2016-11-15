var _ = require('underscore');
var list = require('../../posts.json').list;

function getPostList() {
    return list;
}

exports.getPostList = getPostList;
