var gulp = require('gulp');
var webpack = require('gulp-webpack');

module.exports = function(){
  gulp.src('./standAloneMethods/createBeacon.js')
    .pipe(webpack({
      output: {
        filename: "createBeacon.js"
      },
      resolve: {
        extensions: ['', '.js']
      }
    }))
    .pipe(gulp.dest('./dist/'));
};
