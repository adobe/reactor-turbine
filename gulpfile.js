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

function getExtensionFeatures(baseDir) {
  var extensionDirectories = getExtensionDirectories(baseDir);

  var features = {
    eventDelegates: {},
    conditionDelegates: {},
    extensions: {}
  };

  function getScriptContent(baseDir, extensionDir, featurePath) {
    var featurePath = path.join(baseDir, extensionDir, featurePath);

    if (fs.existsSync(featurePath)) {
      return fs.readFileSync(featurePath, {encoding: 'utf8'});
    }
  }

  function populateDelegates(featureSetType, pkg, extensionDir) {
    if (pkg.hasOwnProperty(featureSetType)) {
      var featureSet = pkg[featureSetType];
      featureSet.forEach(function(feature) {
        var script = getScriptContent(baseDir, extensionDir, feature.path);

        if (script) {
          var id = extensionDir + '.' + path.basename(feature.path, '.js');
          features[featureSetType][id] = wrapInFunction(script, ['module', 'require']);
        }
      });
    }
  }

  function populateExtensions(pkg, extensionDir) {
    if (pkg.hasOwnProperty('engine')) {
      var script = getScriptContent(baseDir, extensionDir, pkg.engine);
      features.extensions[extensionDir] = wrapInFunction(script, ['module', 'require']);
    }
  }

  extensionDirectories.forEach(function(extensionDir) {
    var packagePath = path.join(baseDir, extensionDir, 'package.json');

    if (fs.existsSync(packagePath)) {
      var pkg = JSON.parse(fs.readFileSync(packagePath, { encoding: 'utf8' }));
      populateDelegates('eventDelegates', pkg, extensionDir);
      populateDelegates('conditionDelegates', pkg, extensionDir);
      populateExtensions(pkg, extensionDir);
    }
  });

  return features;

  //return shallowStringifyWithFunctionValues(functionByType);
}

gulp.task('buildConfig', function() {
  var baseDir = './src/config';
  var extensionFeatures = getExtensionFeatures(baseDir);

  return gulp.src([path.join(baseDir, 'config.txt')])
    .pipe(replace('{{eventDelegates}}', shallowStringifyWithFunctionValues(extensionFeatures.eventDelegates)))
    .pipe(replace('{{conditionDelegates}}', shallowStringifyWithFunctionValues(extensionFeatures.conditionDelegates)))
    .pipe(replace('{{extensions}}', shallowStringifyWithFunctionValues(extensionFeatures.extensions)))
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

gulp.task('buildCreateBeacon', require('./standAloneMethods/gulp/createBeaconTask.js'));
