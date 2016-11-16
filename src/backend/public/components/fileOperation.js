var fs = require('fs'),
    path = require('path');

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
    var dirList = fs.readdirSync(baseUrl + (path.length != 0 ? ('/'+path) : '')  + (subDir.length != 0 ? ('/'+subDir) : '') + (path.length != 0 && subDir.length != 0 ? '/' : ''));
    dirList.forEach(function(item) {
        if (fs.statSync(baseUrl + (path.length != 0 ? ('/'+path) : '')  + (subDir.length != 0 ? ('/'+subDir) : '') + '/' + item).isDirectory()) {
            fileList.push({
                path: (path.length != 0 ? (path + '/') : path) + item,
                children: walk(baseUrl, (path.length != 0 ? (path + '/') : path) + subDir, item)
            });
        } else {
            fileList.push({
                path: path,
                file: item
            });
        }
    });
    return fileList;
}
function traverseDir(path) {
    writeJsonFile('./src/backend/public/data/test.json', JSON.stringify(walk(path, '', '')));
}

exports.writeJsonFile = writeJsonFile;
exports.traverseDir = traverseDir;
