var cookie = require('cookie');

/**
 * Reads a cookie value.
 * @param {string} name The name of the cookie to read.
 * @returns {string}
 */
module.exports = function(name) {
  return cookie.parse(document.cookie)[name];
};
