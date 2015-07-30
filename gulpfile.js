var gulp = require('gulp');
//var plugins = require('gulp-load-plugins');
var clean = require('gulp-clean');
var inject = require("gulp-inject");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var minifyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');

var inputRootPath = './app';
var inputPaths = {
    vendorStyles: [inputRootPath + '/bower_components/html5-boilerplate/css/normalize.css',
        inputRootPath + '/bower_components/html5-boilerplate/css/main.css',
        inputRootPath + '/bower_components/bootstrap/dist/css/bootstrap.css'],
    appStyles: inputRootPath + '/app.css',
    vendorScripts: [inputRootPath + '/bower_components/angular/angular.js',
        inputRootPath + '/bower_components/angular-route/angular-route.js',
        inputRootPath + '/bower_components/jquery/dist/jquery.js',
        inputRootPath + '/bower_components/bootstrap/dist/js/bootstrap.js',
        inputRootPath + '/bower_components/angular-bootstrap/ui-bootstrap.js',
        inputRootPath + '/bower_components/threejs/build/three.js',
        inputRootPath + '/components/version/version.js',
        inputRootPath + '/components/version/version-directive.js',
        inputRootPath + '/components/version/interpolate-filter.js'],
    appScripts: [inputRootPath + '/**/*.js', '!' + inputRootPath + '/bower_components/**/*.js', '!' + inputRootPath + '/components/**/*.js', '!' + inputRootPath + '/**/*_test.js'],
    images: inputRootPath + '/img/*',
    htmls: [inputRootPath + '/**/*.html', '!' + inputRootPath + '/index.html', '!' + inputRootPath + '/bower_components/**/*.html', '!' + inputRootPath + '/components/**/*.html']
};

var outputRootPath = '../build';
var outputPaths = {
    all: outputRootPath,
    scripts: outputRootPath + '/js/',
    styles: outputRootPath + '/css/',
    images: outputRootPath + '/img/'
};


gulp.task('vendorScripts', function() {
    return gulp.src(inputPaths.vendorScripts)
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(uglify())
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(outputPaths.scripts));
});

gulp.task('appScripts', function() {
    return gulp.src(inputPaths.appScripts)
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(outputPaths.scripts));
});

gulp.task('scripts', ['vendorScripts', 'appScripts']);

gulp.task('vendorStyles', function() {
    return gulp.src(inputPaths.vendorStyles)
        .pipe(minifyCss())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(outputPaths.styles));
});

gulp.task('appStyles', function() {
    return gulp.src(inputPaths.appStyles)
        .pipe(minifyCss())
        .pipe(concat('app.css'))
        .pipe(gulp.dest(outputPaths.styles));
});

gulp.task('styles', ['vendorStyles', 'appStyles']);

gulp.task('images', function() {
    return gulp.src(inputPaths.images)
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest(outputPaths.images));
});

gulp.task('pages', function() {
    return gulp.src(inputPaths.htmls)
        .pipe(minifyHtml())
        .pipe(gulp.dest(outputPaths.all));
});

gulp.task('index', function () {
    gulp.src(inputRootPath + '/index.html')
        .pipe(inject(
            gulp.src('./js/vendor.js', {cwd: outputPaths.all}), {starttag: '<!-- inject:' + 'vendor' + ':{{ext}} -->', addRootSlash: false}
        ))
        .pipe(inject(
            gulp.src('./js/app.js', {cwd: outputPaths.all}), {starttag: '<!-- inject:' + 'app' + ':{{ext}} -->', addRootSlash: false}
        ))
        .pipe(inject(
            gulp.src('./css/vendor.css', {cwd: outputPaths.all}), {starttag: '<!-- inject:' + 'vendor' + ':{{ext}} -->', addRootSlash: false}
        ))
        .pipe(inject(
            gulp.src('./css/app.css', {cwd: outputPaths.all}), {starttag: '<!-- inject:' + 'app' + ':{{ext}} -->', addRootSlash: false}
        ))
        .pipe(gulp.dest(outputPaths.all))
});

gulp.task('build', ['scripts', 'styles', 'images', 'pages'], function() {
    gulp.run('index');
});

gulp.task('clean', function() {
    return gulp.src(outputPaths.all, {read: false})
        .pipe(clean({force: true}));
});

gulp.task('default',['clean'], function() {
    gulp.run('build');
});