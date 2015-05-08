// TODO: Use this?
var Promise = require('./Promise');

var loadPromise;
module.exports = function() {
  if (!loadPromise) {
    loadPromise = new Promise(function(resolve, reject) {
      if (document.querySelectorAll && document.querySelector) {
        resolve();
      } else {
        // Load Sizzle
      }
    });
  }

  return loadPromise;
};
