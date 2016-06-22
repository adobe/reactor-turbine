// Polyfill for Promises, staying as close as possible to what's specified in both Promises/A+ and
// the upcoming ES6 specification.

var window = require('window');
var Promise = window.Promise;

if (typeof Promise === 'undefined') {
  Promise = require('native-promise-only');
  // native-promise-only will set window.Promise if it doesn't exist. In our case,
  // we don't want to be setting globals so we'll return the global back to undefined.
  window.Promise = undefined;
}

module.exports = Promise;
