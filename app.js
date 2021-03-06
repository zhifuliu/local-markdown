var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var loginFilter = require('./public/filter/loginFilter');
var paramsFilter = require('./public/filter/paramsFilter');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json()); // 为了能获取到参数
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(express.static('./test/'));
app.use(cookieParser('', {
    maxAge: 24 * 60 * 60000
}));
// 使用  session 中间件
app.use(
    session({
        secret: 'locale_markdown_write', // 建议使用 128 个字符的随机字符串。用于计算 hash 值并存放在 cookies 中
        cookie: {
            maxAge: 24 * 60 * 60000
        },
        resave: true,
        saveUninitialized: false
    })
);
// app.use(express.static(path.join(__dirname, 'test')));
// express.js 允许跨域
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:1314');
    res.header('Access-Control-Allow-Origin', 'http://localhost:9001');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, api_key');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', true);
    if (req.method == 'OPTIONS') {
        res.send(200); // 让options请求快速返回
    } else {
        next();
    }
});
//api
app.use('/api/login', require('./public/api/login'));
app.use('/api/logout', loginFilter, require('./public/api/logout'));
app.use('/api/getUserMsg', loginFilter, require('./public/api/getUserMsg'));

app.use('/api/getProjectList', loginFilter, require('./public/api/getProjectList'));
app.use('/api/addProject', loginFilter, require('./public/api/addProject'));
app.use('/api/deleteProject', loginFilter, require('./public/api/deleteProject'));

app.use('/api/refreshProject', loginFilter, require('./public/api/refreshProject'));
app.use('/api/getProjectData', loginFilter, require('./public/api/getProjectData'));
app.use('/api/getMdData', loginFilter, require('./public/api/getMdData'));
app.use('/api/changeMdData', loginFilter, require('./public/api/changeMdData'));


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that');
});
// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports = app;
