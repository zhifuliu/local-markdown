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
        } catch(error) {
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

exports.writeJsonFile = writeJsonFile;
