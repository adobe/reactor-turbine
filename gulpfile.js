var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// var src = ['**/satelliteLib*.js', '**/satellite-overrides.js'];
// var tests = ['**/test*'];
//
// gulp.task('test', function() {
//   return gulp.src(src, {
//       read: false
//     })
//     .pipe($.debug({
//       title: 'unicorn:'
//     }))
//     .pipe($.cover.instrument({
//       pattern: tests,
//       debugDirectory: 'debug'
//     }))
//     .pipe($.mocha())
//     .pipe($.cover.gather())
//     .pipe($.cover.format())
//     .pipe(gulp.dest('reports'));
// });


gulp.task("webpack", function() {
  return gulp.src('./framework-structure/bootstrap.js')
    .pipe($.webpack({
      output: {
        filename: "bundle.js"
      },
      devtool: "#inline-source-map",
      resolve: {
        extensions: ['', '.js']
      }
    })).pipe(gulp.dest('./framework-structure/dist/'));
});

gulp.task('watch', function() {
  gulp.watch(['./framework-structure/**/*.js', '!./framework-structure/dist/**/*'], ['webpack']);
});

gulp.task('default', ['webpack','watch']);
