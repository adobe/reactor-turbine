'use strict';

// We expose this task to be used by other projects.
module.exports = function(gulp) {
  require('./tasks/build')(gulp);
};
