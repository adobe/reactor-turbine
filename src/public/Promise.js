// Polyfill for Promises, staying as close as possible to what's specified in both Promises/A+ and
// the upcoming ES6 specification.
// native-promise-only will set window.Promise if it doesn't exist. In our case, we don't want to
// be setting globals so we'll return the global back to prior value after native-promise-only
// is run.

var priorGlobal = window.Promise;
var Promise = require('native-promise-only');
window.Promise = priorGlobal;

module.exports = Promise;
