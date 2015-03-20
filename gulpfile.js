var gulp = require('gulp');
var mocha = require('gulp-mocha');
var cover = require('gulp-coverage');
var debug = require('gulp-debug');

var src = ['**/satelliteLib*.js','**/satellite-overrides.js'];
var tests = ['**/test*'];

gulp.task('test', function () {
    return gulp.src(src, { read: false })
        .pipe(debug({title: 'unicorn:'}))
        .pipe(cover.instrument({
            pattern: tests,
            debugDirectory: 'debug'
        }))
        .pipe(mocha())
        .pipe(cover.gather())
        .pipe(cover.format())
        .pipe(gulp.dest('reports'));
});
