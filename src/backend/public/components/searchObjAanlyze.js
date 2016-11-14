var _ = require('underscore');

function getAllIndexs(searchObject, aim) {
    var allIndexs = [];
    var tempIndex = 0;
    var temp = searchObject;
    for (var i=0;temp.length>0;) {
        tempIndex = temp.indexOf(aim);
        if (tempIndex != -1) {
            if (i === 0) {
                allIndexs.push(
                    {
                        index: tempIndex,
                        value: aim
                    }
                );
                temp = temp.substring(tempIndex+1, temp.length);
                i++;
            } else {
                allIndexs.push(
                    {
                        index: allIndexs[i-1].index + 1 + tempIndex,
                        value: aim
                    }
                );
                temp = temp.substring(tempIndex+1, temp.length);
                i++;
            }
        } else {
            break;
        }
    }
    return allIndexs;
}
function getSearchObj(searchStr) {
    console.log(searchStr);
    var tagName = {
        url: 'url',
        bz: 'remark',
        bt: 'title'
    }
    if (searchStr.length !== 0) {
        var resultObj = {};
        var level = 1;
        var symbol = {
            and: '&&',
            or: '||'
        };
        if (searchStr.indexOf('&&') !== -1 || searchStr.indexOf('||') !== -1) {
            level = 1;
            symbol.and = '&&';
            symbol.or = '||';
        } else if (searchStr.indexOf('&') !== -1 || searchStr.indexOf('|') !== -1) {
            level = 2;
            symbol.and = '&';
            symbol.or = '|';
        } else {
            level = 0;
            var reg = '/' + searchStr.split(':')[1] + '/i';
            // resultObj[tagName[searchStr.split(':')[0]]] = searchStr.split(':')[1];
            resultObj[tagName[searchStr.split(':')[0]]] = eval(reg);
            return {
                resultCode: 0,
                resultMsg: resultObj
            };
        }
        // console.log(level);
        var leftArrowObjs = getAllIndexs(searchStr, '(');
        var rigthArrowObjs = getAllIndexs(searchStr, ')');
        var allArrowObjs = [];
        _.every(leftArrowObjs, item => allArrowObjs.push(item));
        _.every(rigthArrowObjs, item => allArrowObjs.push(item));
        allArrowObjs = _.sortBy(allArrowObjs, item => item.index);
        if (leftArrowObjs.length === rigthArrowObjs.length) {
            var out = [];
            if (leftArrowObjs.length !== 0) {
                var flag = -1;
                allArrowObjs = _.map(allArrowObjs, item => {
                    return {
                        index: item.index,
                        value: item.value,
                        v: item.value == '(' ? ++flag : --flag
                    };
                });
                // 标识是否已经有0
                flag = false;
                var l = 0;
                for (var i=0,j=0; i<allArrowObjs.length; i++) {
                    if (!flag && allArrowObjs[i].v === 0) {
                        flag = true;
                        l = allArrowObjs[i].index;
                    } else if(allArrowObjs[i].v === -1) {
                        out.push({
                            l: l,
                            r: allArrowObjs[i].index
                        });
                        flag = false;
                        j++;
                    } else{}
                }
                for (i=0; i< out.length; i++) {
                    if (searchStr.substring(out[i].l+1, out[i].r).indexOf(symbol.and) === -1 && searchStr.substring(out[i].l+1, out[i].r).indexOf(symbol.or) === -1) {
                        out.splice(i,1);
                    } else {
                        out[i]['value'] = searchStr.substring(out[i].l+1, out[i].r);
                    }
                }
                for (i=out.length-1; i >= 0; i--) {
                    searchStr = searchStr.substring(0, out[i].l) + 'out-' + i + searchStr.substring(out[i].r+1, searchStr.length);
                }
                // console.log(searchStr);
            }

            var searchList = [];
            _.every(getAllIndexs(searchStr, symbol.and), item => searchList.push(item));
            _.every(getAllIndexs(searchStr, symbol.or), item => searchList.push(item));
            searchList = _.sortBy(searchList, item => item.index);
            // console.log(searchStr);
            // console.log(out);
            // console.log(searchList);
            if (searchList.length === 0) {
                var key = searchStr.split(':')[0];
                var value = searchStr.split(':')[1];
                if (searchStr.split(':')[1].indexOf('out-') != -1) {
                    resultObj[searchStr.split(':')[0]] = out[parseInt(value.substring(value.indexOf('out-')+4, value.length))].value;
                    return {
                        resultCode: 0,
                        resultMsg: resultObj
                    };
                    //return getSearchObj(resultObj);
                } else {
                    resultObj[searchStr.split(':')[0]] = value;
                    return {
                        resultCode: 0,
                        resultMsg: resultObj
                    };
                }
            } else {
                var tempArray = [];
                var sym = searchStr.substring(searchList[0].index, searchList[0].index + searchList[0].value.length);
                var title = searchStr.split(':')[0];
                // var v1 = searchStr.substring(searchStr.split(':')[0].length+1, searchList[0].index);
                console.log(searchStr);
                console.log(title);
                var v1 = searchStr.substring(searchStr.split(':')[0].length+1, searchList[0].index);
                var v2 = searchStr.substring(searchList[0].index + searchList[0].value.length, searchStr.length);
                console.log(v1);
                console.log(v2);
                var index = 0;
                var reg = /(out-\d)/g;
                for (;reg.exec(v1);) {
                    v1 = v1.replace(reg, out[index++].value);
                }
                for (;reg.exec(v2);) {
                    v2 = v2.replace(reg, '(' + out[index++].value + ')');
                }
                console.log(v1);
                console.log(v2);
                if (level == 1) {
                    console.log('22222二级');
                    if (sym == '&&') {
                        console.log('&&&&&&');
                        tempArray[0] = getSearchObj(title + ':' + v1).resultMsg;
                        tempArray[1] = getSearchObj(v2).resultMsg;
                        resultObj.$and = tempArray;
                        return {
                            resultCode: 0,
                            resultMsg: resultObj
                        };
                    } else {
                        console.log('||||||');
                        tempArray[0] = getSearchObj(title + ':' + v1).resultMsg;
                        tempArray[1] = getSearchObj(v2).resultMsg;
                        console.log(tempArray[0]);
                        console.log(tempArray[1]);
                        resultObj.$or = tempArray;
                        return {
                            resultCode: 0,
                            resultMsg: resultObj
                        };
                    }
                } else {
                    if (sym == '&') {
                        tempArray[0] = getSearchObj(title + ':' + v1).resultMsg;
                        tempArray[1] = getSearchObj(title + ':' + v2).resultMsg;
                        resultObj.$and = tempArray;
                        return {
                            resultCode: 0,
                            resultMsg: resultObj
                        };
                    } else {
                        tempArray[0] = getSearchObj(title + ':' + v1).resultMsg;
                        tempArray[1] = getSearchObj(title + ':' + v2).resultMsg;
                        resultObj.$or = tempArray;
                        return {
                            resultCode: 0,
                            resultMsg: resultObj
                        };
                    }
                }
            }
        } else {
            return {
                resultCode: -1,
                resultMsg: 'arrow not match'
            };
        }
    } else {
        return {
            resultCode: -1,
            resultMsg: 'length is zero'
        };
    }
}

exports.getAllIndexs = getAllIndexs;
exports.getSearchObj = getSearchObj;
