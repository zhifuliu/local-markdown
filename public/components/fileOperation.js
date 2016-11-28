var fs = require('fs'),
    pathComponents = require('path');

function writeJsonFile(filepath, data) {
    var ws = fs.createWriteStream(filepath);
    ws
        .on('error', function(err) {
            console.log(err);
        })
        .on('data', function(chunk) {
            console.log('writeStream data event');
        })
        .on('end', function() {
            console.log('writeStream end');
        })
        .on('event', function(msg) {
            console.log(msg);
        });
    ws.once('open', function(feedback) {
        try {
            ws.write(new Buffer(data, 'utf-8'));
            ws.end();
        } catch (error) {
            console.log(error);
        }
    });
}
function writeFile(filepath, data) {
    console.log('2');
    // var ws = fs.createWriteStream(filepath);
    // ws.once('open', function(feedback) {
    //     try {
    //         ws.write(new Buffer(data, 'utf-8'));
    //         ws.end();
    //         console.log('3');
    //     } catch (error) {
    //         console.log(error);
    //     }
    // });
    fs.writeFileSync(filepath, data, 'utf-8', function (err, data) {
        console.log('3');
        if (err) {
            console.log(err);
        } else {
            console.log(data);
        }
    });
}
function writeJsonFileBackup(filepath, data) {
    fs.writeFile(filepath, data, function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log('save success');
        }
    });
}

function walk(baseUrl, path, subDir) {
    var fileList = [];
    var dirList = fs.readdirSync(baseUrl + (path.length !== 0 ? ('/'+path) : '')  + (subDir.length !== 0 ? ('/'+subDir) : '') + (path.length !== 0 && subDir.length !== 0 ? '/' : ''));
    dirList.forEach(function(item) {
        if (fs.statSync(baseUrl + (path.length !== 0 ? ('/'+path) : '')  + (subDir.length !== 0 ? ('/'+subDir) : '') + '/' + item).isDirectory()) {
            var children = walk(baseUrl, (path.length !== 0 ? (path + '/') : path) + subDir, item);
            if (children.length !== 0) {
                fileList.push({
                    path: (path.length !== 0 ? (path + '/') : '') + (subDir.length !== 0 ? (subDir + '/') : '') + item,
                    children: children
                });
            }
        } else {
            var markdownSuffix = ['.md', '.markdown'];
            if (markdownSuffix.indexOf(pathComponents.extname(item)) != -1) {
                fileList.push({
                    path: (path.length !== 0 ? (path + '/') : '') + (subDir.length !== 0 ? (subDir + '/') : ''),
                    file: item
                });
            }
        }
    });
    return fileList;
}
function traverseDir(path, name) {
    writeJsonFile('./public/data/' + name + '.json', JSON.stringify(walk(path, '', '')));
}

exports.writeJsonFile = writeJsonFile;
exports.traverseDir = traverseDir;
exports.writeFile = writeFile;
