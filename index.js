'use strict';

// We expose these tasks to be used by the turbine-gulp-builder project.
module.exports = function(gulp) {
  require('./tasks/buildEngine')(gulp);
  require('./tasks/compressEngine')(gulp);
};
