var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

var loginFilter = require('./public/filter/loginFilter');

var app = express();

// view engine setup,use jade engine
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json()); // 为了能获取到参数
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(express.static('./public/pages'));
app.use(cookieParser('', {
    maxAge: 2 * 60 * 1000
}));
// 使用  session 中间件
app.use(
    session({
        secret: 'collect', // 建议使用 128 个字符的随机字符串。用于计算 hash 值并存放在 cookies 中
        cookie: {
            maxAge: 2 * 60 * 1000
        },
        resave: true,
        saveUninitialized: false
    })
);
app.use(express.static(path.join(__dirname, 'public')));

// express.js 允许跨域
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200); // 让options请求快速返回
    } else {
        next();
    }
});
//api
app.use('/api/login', loginFilter, require('./public/api/login'));


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that');
});
// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

// 如果添加这一行,那么可以直接通过 node app.js 来运行应用,但是通过 gulp 那么就会报错,估计是端口冲突
// app.listen(3000, function() {
//   console.log('collect-node listening on port 3000!');
// });

module.exports = app;
