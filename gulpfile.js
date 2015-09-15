var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var uglify = require('gulp-uglify');
var gzip = require('gulp-gzip');
var fs = require('fs');
var path = require('path');
var KarmaServer = require('karma').Server;
var webpack = require('webpack-stream');

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

function getDelegates(baseDir) {
  var delegates = {};

  var populateFeatureDelegates = function(delegateType, pkg, extensionDir) {
    delegates[delegateType] = delegates[delegateType] || {};

    if (pkg.hasOwnProperty(delegateType)) {
      var featureSet = pkg[delegateType];
      featureSet.forEach(function(feature) {
        var script = getScriptContent(baseDir, extensionDir, feature.path);

        if (script) {
          var id = pkg.name + '.' + path.basename(feature.path, '.js');
          delegates[delegateType][id] = wrapInFunction(script, ['module', 'require']);
        }
      });
    }
  };

  iterateExtensionPackages(baseDir, function(pkg, extensionDir) {
    populateFeatureDelegates('eventDelegates', pkg, extensionDir);
    populateFeatureDelegates('conditionDelegates', pkg, extensionDir);
    populateFeatureDelegates('actionDelegates', pkg, extensionDir);
    populateFeatureDelegates('dataElementDelegates', pkg, extensionDir);
    populateFeatureDelegates('resources', pkg, extensionDir);
  });

  return delegates;
}

function getResources(baseDir) {
  var resources = {};

  iterateExtensionPackages(baseDir, function(pkg, extensionDir) {
    if (pkg.hasOwnProperty('resources')) {
      var descriptors = pkg.resources;
      descriptors.forEach(function(descriptor) {
        var resourceId = pkg.name + '/' + descriptor.name;
        var script = getScriptContent(baseDir, extensionDir, descriptor.path);
        resources[resourceId] = wrapInFunction(script, ['module', 'require']);
      });
    }
  });

  return resources;
}

function getPackageForExtensionDir(baseDir, extensionDir) {
  var packagePath = path.join(baseDir, extensionDir, 'extension.json');

  if (fs.existsSync(packagePath)) {
    return JSON.parse(fs.readFileSync(packagePath, {encoding: 'utf8'}));
  }
}

function getExtensionMeta(baseDir) {
  var extensionMeta = {};

  iterateExtensionPackages(baseDir, function(pkg) {
    extensionMeta[pkg.name] = {
      name: pkg.displayName
    };
  });

  return extensionMeta;
}

function getScriptContent(baseDir, extensionDir, scriptPath) {
  var featurePath = path.join(baseDir, extensionDir, scriptPath);

  if (fs.existsSync(featurePath)) {
    return fs.readFileSync(featurePath, {encoding: 'utf8'});
  }
}

function iterateExtensionPackages(baseDir, callback) {
  getExtensionDirectories(baseDir).forEach(function(extensionDir) {
    var pkg = getPackageForExtensionDir(baseDir, extensionDir);

    if (pkg) {
      callback(pkg, extensionDir);
    }
  });
}

function stringifyWithLiteralFunctions(delegates) {
  return JSON.stringify(delegates)
    .replace(/(".+?":)"(function.+?}\\n)"/g, '$1$2')
    .replace(/\\n/g, '\n');
}

gulp.task('buildContainer', function() {
  var extensionsDir = './src/extensions';
  var delegates = getDelegates(extensionsDir);
  var resources = getResources(extensionsDir);
  var extensionMeta = getExtensionMeta(extensionsDir);

  return gulp.src(['container.txt'])
    .pipe(replace('{{eventDelegates}}', stringifyWithLiteralFunctions(delegates.eventDelegates)))
    .pipe(replace('{{conditionDelegates}}', stringifyWithLiteralFunctions(delegates.conditionDelegates)))
    .pipe(replace('{{actionDelegates}}', stringifyWithLiteralFunctions(delegates.actionDelegates)))
    .pipe(replace('{{dataElementDelegates}}', stringifyWithLiteralFunctions(delegates.dataElementDelegates)))
    .pipe(replace('{{resources}}', stringifyWithLiteralFunctions(resources)))
    .pipe(replace('{{extensions}}', JSON.stringify(extensionMeta)))
    .pipe(rename('container.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('compressContainer', ['buildContainer'], function() {
  return gulp.src(['./dist/container.js'])
    .pipe(rename('container.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(gzip())
    .pipe(gulp.dest('./dist'));
});

gulp.task('buildEngine', function() {
  return gulp.src('./src/engine/bootstrap.js')
    .pipe(webpack({
      output: {
        filename: 'engine.js'
      },
      //devtool: 'source-map', // Doesn't match the right lines in the debugger half the time. :/
      resolve: {
        extensions: ['', '.js']
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'strict'
          }
        ]
      },
      externals: {
        // So that modules can require('window') and then tests can mock it.
        window: 'window',
        document: 'document'
      }
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('compressEngine', ['buildEngine'], function() {
  return gulp.src('./dist/engine.js')
    .pipe(rename('engine.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'))
    .pipe(gzip())
    .pipe(gulp.dest('./dist'));
});

function startKarma(browsers) {
  new KarmaServer({
    configFile: path.join(__dirname, 'karma.conf.js'),
    browsers: browsers
  }).start();
}

// Typically we wouldn't be dependent upon building the full engine and config (by running the
// "default" task first) since Karma would dynamically compile the pieces under test, but because
// we have functional tests that work within iframes and are dependent upon the full engine and
// config, this is necessary.
gulp.task('test', ['default'], function() {
  startKarma([
      'Chrome'
    ]);
});

gulp.task('testall', ['default'], function() {
  startKarma([
      'Chrome',
      'Firefox',
      'Safari',
      'IE9 - Win7',
      'IE10 - Win7',
      'IE11 - Win7'
    ]);
});

gulp.task('watch', function() {
  gulp.watch(['./src/extensions/{,**/!(__tests__)}/*', './container.txt'], ['buildContainer']);
  gulp.watch(['./src/engine/{,**/!(__tests__)}/*.js'], ['buildEngine']);
});

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe($.eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe($.eslint.format('stylish'))
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failOnError last.
    .pipe($.eslint.failAfterError());
});

gulp.task('default', ['buildContainer', 'buildEngine', 'watch']);
