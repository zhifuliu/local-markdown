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
    webServer = require('gulp-webserver'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload');

gulp.task('web', ['develop', 'webserver']);
gulp.task('develop', function() {
    // livereload.listen();
    nodemon({
        script: './src/backend/bin/www',
        ext: 'js',
        stdout: false
    }).on('readable', function() {
        this.stdout.on('data', function(chunk) {
            if (/^Express server listening on port/.test(chunk)) {
                livereload.changed(__dirname);
            }
        });
        this.stdout.pipe(process.stdout);
        this.stderr.pipe(process.stderr);
    });
});

// WebServer
gulp.task('webserver', ['auto-ts'], function() {
    var config;
    try {
        config = require('./proxyConfig');
        gutil.log('load configuration file');
    } catch (e) {
        config = {
            "server": "http://127.0.0.1:8888",
            "port": 8889
        };
        gutil.log('using default configuration: ', config);
    }

    gulp.src('./src/front/')
        .pipe(webServer({
            host: '0.0.0.0',
            fallback: 'index.html',
            livereload: {
                enable: true,
                port: 8900
            },
            directoryListing: true,
            port: config.port,
            proxies: [{
                source: '/api',
                target: config.server
            }]
        }));
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
    var distContents = gulp.src(['./dist/**/*', './**/.DS_Store'], {
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
