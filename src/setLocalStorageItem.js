//Required for mocking out the window object in setLocalStorageItem.test.js
var window = require('window');

/**
 * Saves a value to local storage.
 * @param {string} name The name of the item to be saved.
 * @param {string} value The value of the item to be saved.
 * @returns {boolean} Whether the item was successfully saved to local storage.
 */
module.exports = function(name, value) {
  // When local storage is disabled on Safari, the mere act of referencing window.localStorage
  // throws an error. For this reason, referencing window.localStorage without being inside
  // a try-catch should be avoided.
  try {
    window.localStorage.setItem(name, value);
    return true;
  } catch (e) {
    return false;
  }
};
