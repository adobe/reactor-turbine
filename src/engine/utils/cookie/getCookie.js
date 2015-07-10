/**
 * Reads a cookie value.
 * @param {string} name The name of the cookie to read.
 * @returns {string}
 */
module.exports = function(name) {
  var nameEQ = name + '=';
  var parts = document.cookie.split(';');
  for (var i = 0; i < parts.length; i++) {
    var c = parts[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return null;
};
