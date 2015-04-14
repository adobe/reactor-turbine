var gulp = require('gulp');
var merge = require('ordered-merge-stream');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var fs = require('fs');
var path = require('path');

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

function wrapInFunction(content, argNames) {
  var argsStr = argNames ? argNames.join(', ') : '';
  return 'function(' + argsStr + ') {\n' + content + '}\n';
}

function getFunctionsFromFiles(directory, argNames) {
  var output = '{';

  var filenames = fs.readdirSync(directory);
  filenames.forEach(function(filename) {
    var type = path.basename(filename, '.js');
    var functionContent = fs.readFileSync(directory + filename);
    output += '\n"' + type + '": ' + wrapInFunction(functionContent, argNames) + ',';
  });

  output += '}';

  return output;
}

function getExtensions() {
  var extensions = [
    {
      name: 'AdobeAnalytics'
    },
    {
      name: 'AdobeTarget',
      dependencies: [
        'AdobeVisitor'
      ]
    },
    {
      name: 'AdobeVisitor'
    },
    {
      name: 'AdobeDebug'
    }
  ]

  var directory = './framework-structure/extensions/';

  var extensionsStr = '{';

  extensions.forEach(function(extension) {
    extensionsStr += '"' + extension.name + '": {';
    extensionsStr += 'script: ' + wrapInFunction(fs.readFileSync(directory + extension.name + '.js'));

    if (extension.dependencies) {
      extensionsStr += ', dependencies: ["' + extension.dependencies.join(',') + '"]'
    }
    extensionsStr += '},'
  });

  extensionsStr += '}';

  return extensionsStr;
}

gulp.task("webpack", function() {
  var events = getFunctionsFromFiles('./framework-structure/events/', ['eventSettingsCollection', 'callback']);
  var conditions = getFunctionsFromFiles('./framework-structure/conditions/', ['conditionSettings', 'event']);
  var extensions = getExtensions();

  var config = gulp.src(['./framework-structure/config.txt'])
    .pipe(replace('{{events}}', events))
    .pipe(replace('{{conditions}}', conditions))
    .pipe(replace('{{extensions}}', extensions));

  var engine = gulp.src('./framework-structure/bootstrap.js')
    .pipe($.webpack({
      output: {
        filename: "bundle.js"
      },
      devtool: "#inline-source-map",
      resolve: {
        extensions: ['', '.js']
      }
    }));

  return merge([config, engine])
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./framework-structure/dist'));
});

gulp.task('watch', function() {
  gulp.watch(['./framework-structure/**/*.js', '!./framework-structure/dist/**/*'], ['webpack']);
});

gulp.task('default', ['webpack','watch']);
