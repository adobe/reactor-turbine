var gulp = require('gulp');
var merge = require('ordered-merge-stream');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var fs = require('fs');
var path = require('path');

var $ = require('gulp-load-plugins')();

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
    },
    {
      name: 'FacebookConnect'
    }
  ];

  var directory = './src/config/extensions/';

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

gulp.task('buildConfig', function() {
  var events = getFunctionsFromFiles('./src/config/events/', ['eventSettingsCollection', 'callback']);
  var conditions = getFunctionsFromFiles('./src/config/conditions/', ['conditionSettings', 'event']);
  var extensions = getExtensions();

  return gulp.src(['./src/config/config.txt'])
    .pipe(replace('{{events}}', events))
    .pipe(replace('{{conditions}}', conditions))
    .pipe(replace('{{extensions}}', extensions))
    .pipe(rename('config.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task("buildEngine", function() {
  return gulp.src('./src/engine/bootstrap.js')
    .pipe($.webpack({
      output: {
        filename: "engine.js"
      },
      devtool: "#inline-source-map",
      resolve: {
        extensions: ['', '.js']
      }
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/config/**/*'], ['buildConfig']);
  gulp.watch(['./src/engine/**/*.js'], ['buildEngine']);
});

gulp.task('default', ['buildConfig', 'buildEngine', 'watch']);
