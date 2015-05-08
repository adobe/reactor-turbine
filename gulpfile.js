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

function getDelegates(baseDir) {
  var extensionDirectories = getExtensionDirectories(baseDir);

  var delegates = {
    eventDelegates: {},
    conditionDelegates: {},
    dataElementDelegates: {},
    extensionDelegates: {}
  };

  function getScriptContent(baseDir, extensionDir, featurePath) {
    var featurePath = path.join(baseDir, extensionDir, featurePath);

    if (fs.existsSync(featurePath)) {
      return fs.readFileSync(featurePath, {encoding: 'utf8'});
    }
  }

  function populateFeatureDelegates(delegateType, pkg, extensionDir) {
    if (pkg.hasOwnProperty(delegateType)) {
      var featureSet = pkg[delegateType];
      featureSet.forEach(function(feature) {
        var script = getScriptContent(baseDir, extensionDir, feature.path);

        if (script) {
          var id = extensionDir + '.' + path.basename(feature.path, '.js');
          delegates[delegateType][id] = wrapInFunction(script, ['module', 'require']);
        }
      });
    }
  }

  function populateExtensionDelegates(pkg, extensionDir) {
    if (pkg.hasOwnProperty('engine')) {
      var script = getScriptContent(baseDir, extensionDir, pkg.engine);
      delegates.extensionDelegates[extensionDir] = wrapInFunction(script, ['module', 'require']);
    }
  }

  extensionDirectories.forEach(function(extensionDir) {
    var packagePath = path.join(baseDir, extensionDir, 'package.json');

    if (fs.existsSync(packagePath)) {
      var pkg = JSON.parse(fs.readFileSync(packagePath, { encoding: 'utf8' }));
      populateFeatureDelegates('eventDelegates', pkg, extensionDir);
      populateFeatureDelegates('conditionDelegates', pkg, extensionDir);
      populateFeatureDelegates('dataElementDelegates', pkg, extensionDir);
      populateFeatureDelegates('extensionDelegates', pkg, extensionDir);
      populateExtensionDelegates(pkg, extensionDir);
    }
  });

  return delegates;
}

gulp.task('buildConfig', function() {
  var baseDir = './src/config';
  var delegates = getDelegates(baseDir);

  return gulp.src([path.join(baseDir, 'config.txt')])
    .pipe(replace('{{eventDelegates}}', shallowStringifyWithFunctionValues(delegates.eventDelegates)))
    .pipe(replace('{{conditionDelegates}}', shallowStringifyWithFunctionValues(delegates.conditionDelegates)))
    .pipe(replace('{{extensionDelegates}}', shallowStringifyWithFunctionValues(delegates.extensionDelegates)))
    .pipe(replace('{{dataElementDelegates}}', shallowStringifyWithFunctionValues(delegates.dataElementDelegates)))
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
