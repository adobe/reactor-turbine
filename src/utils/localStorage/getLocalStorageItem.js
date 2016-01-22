var window = require('window'); //Required for mocking out the window object in getLocalStorageItem.test.js

/**
 * Reads a value from local storage.
 * @param {string} name The name of the item to be read.
 * @returns {string}
 */
module.exports = function(name) {
  // When local storage is disabled on Safari, the mere act of referencing window.localStorage
  // throws an error. For this reason, referencing window.localStorage without being inside
  // a try-catch should be avoided.
  try {
    return window.localStorage.getItem(name);
  } catch (e) {
    return null;
  }
};
