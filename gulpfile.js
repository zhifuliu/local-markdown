// Node modules
var fs = require('fs'),
    vm = require('vm'),
    merge = require('deeply'),
    chalk = require('chalk'),
    es = require('event-stream');

// Gulp and plugins
var gulp = require('gulp'),
    rjs = require('gulp-requirejs-bundler'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    htmlreplace = require('gulp-html-replace'),
    typescript = require('gulp-tsc'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    proxy = require('http-proxy-middleware');

// WebServer
gulp.task('webserver', ['auto-ts'], function() {
    var config;
    try {
        config = require('./proxyConfig');
    } catch (e) {
        config = {
            "proxy": {
                "host": "http://test.winbaoxian.com/"
            },
            "host": {
                "port": 3000,
                "host": "127.0.0.1"
            }
        };
    }
    var proxy_middleware = proxy(['/insure/**', '/user/**', '/static/**', '/view/**'], {
        target: config.proxy.host,
        changeOrigin: true
    });
    browserSync.init({
        middleware: [proxy_middleware],
        port: config.host.port,
        server: {
            baseDir: './src/front/'
        },
        index: './index.html',
        files: './src/**/*.*'
    });
});

gulp.task('test', ['ts'], function() {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js',
        action: 'run'
    }).start();
});

gulp.task('auto-ts', ['ts'], function() {
    gulp.watch('**/*.ts', function() {
        gulp.src(['**/*.ts'])
            .pipe(typescript({
                module: 'amd',
                sourcemap: true,
                outDir: './',
                target: 'es5'
            }))
            .on('error', gutil.log)
            .pipe(gulp.dest('./'));
    });
});

var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('./src/front/app/require.config.js') + '; require;');
requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
    out: 'scripts.js',
    baseUrl: './src/front',
    name: 'app/startup',
    paths: {
        requireLib: 'bower_modules/requirejs/require'
    },
    include: [
        'requireLib',
        'components/nav-bar/nav-bar',
        'components/home-page/home',
        'text!components/about-page/about.html'
    ],
    insertRequire: ['app/startup'],
    bundles: {}
});

gulp.task('ts', function() {
    return gulp.src(['**/*.ts'])
        .pipe(typescript({
            module: 'amd',
            sourcemap: true,
            outDir: './',
            target: 'es5'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('js', ['ts'], function() {
    return rjs(requireJsOptimizerConfig)
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('css', function() {
    var bowerCss = gulp.src('./src/front/bower_modules/components-bootstrap/css/bootstrap.min.css')
        .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        appCss = gulp.src('./src/front/css/*.css'),
        combinedCss = es.concat(bowerCss, appCss).pipe(concat('css.css')),
        fontFiles = gulp.src('./src/front/bower_modules/components-bootstrap/fonts/!*', {
            base: './src/front/bower_modules/components-bootstrap/'
        });
    return es.concat(combinedCss, fontFiles)
        .pipe(gulp.dest('./dist/'));
});

gulp.task('html', function() {
    return gulp.src('./src/front/index.html')
        .pipe(htmlreplace({
            'css': 'css.css',
            'js': 'scripts.js'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function() {
    var distContents = gulp.src('./dist/**/*', {
            read: false
        }),
        generatedJs = gulp.src(['./src/front/**/*.js', './src/front/**/*.js.map', 'test/**/*.js', 'test/**/*.js.map'], {
            read: false
        })
        .pipe(es.mapSync(function(data) {
            return fs.existsSync(data.path.replace(/\.js(\.map)?$/, '.ts')) ? data : undefined;
        }));
    return es.merge(distContents, generatedJs).pipe(clean());
});

gulp.task('default', ['html', 'js', 'css'], function(callback) {
    callback();
    console.log('\nPlaced optimized files in ' + chalk.magenta('dist/\n'));
});
