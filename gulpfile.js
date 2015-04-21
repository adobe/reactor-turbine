var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var fs = require('fs');
var path = require('path');

var $ = require('gulp-load-plugins')();

function wrapInFunction(content, argNames) {
  var argsStr = argNames ? argNames.join(', ') : '';
  return 'function(' + argsStr + ') {\n' + content + '}\n';
}

function getExtensionDirectories(baseDir) {
  return fs.readdirSync(baseDir).filter(function(file) {
    return fs.statSync(path.join(baseDir, file)).isDirectory();
  });
}

function shallowStringifyWithFunctionValues(obj) {
  var output = '{';

  for (var key in obj) {
    var value = obj[key];
    output += '\n"' + key + '": ' + value + ',';
  }

  output += '}';

  return output;
}

function getExtensionFactories(baseDir, functionWrapArgs) {
  var dependencyMap = {
    'adobeTarget': ['adobeVisitor']
  };

  var extensionsStr = '{';

  getExtensionDirectories(baseDir).forEach(function(extensionDir) {
    var factoryPath = path.join(baseDir, extensionDir, 'index.js');

    if (fs.existsSync(factoryPath)) {
      extensionsStr += '"' + extensionDir + '": {';
      extensionsStr += 'script: ' +
          wrapInFunction(fs.readFileSync(factoryPath), functionWrapArgs);

      var dependencies = dependencyMap[extensionDir];
      if (dependencies) {
        extensionsStr += ', dependencies: ["' + dependencies.join(',') + '"]'
      }
      extensionsStr += '},'
    }
  });

  extensionsStr += '}';

  return extensionsStr;
}

function getExtensionFeatures(baseDir, feature, functionWrapArgs) {
  var functionByType = {};
  var extensionDirectories = getExtensionDirectories(baseDir);

  extensionDirectories.forEach(function(extensionDir) {
    var featureDir = path.join(baseDir, extensionDir, feature);
    if (fs.existsSync(featureDir)) {
      fs.readdirSync(featureDir).forEach(function(filename) {
        var type = path.basename(filename, '.js');
        var eventFile = path.join(featureDir, filename);
        var functionContent = fs.readFileSync(eventFile, { encoding: 'utf8' });
        functionByType[extensionDir + '.' + type] = wrapInFunction(functionContent, functionWrapArgs);
      });
    }
  });

  return shallowStringifyWithFunctionValues(functionByType);
}

gulp.task('buildConfig', function() {
  var baseDir = './src/config';
  var events = getExtensionFeatures(baseDir, 'events', ['eventSettingsCollection', 'callback', 'extensions']);
  var conditions = getExtensionFeatures(baseDir, 'conditions', ['conditionSettings', 'event', 'extensions']);
  var factories = getExtensionFactories(baseDir, ['propertySettings', 'dependencies']);

  return gulp.src([path.join(baseDir, 'config.txt')])
    .pipe(replace('{{events}}', events))
    .pipe(replace('{{conditions}}', conditions))
    .pipe(replace('{{extensions}}', factories))
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
