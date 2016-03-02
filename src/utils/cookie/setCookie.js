var cookie = require('cookie');

/**
 * Writes a cookie.
 * @param {string} name The name of the cookie to save.
 * @param {string} value The value of the cookie to save.
 * @param {number} [days] The number of days to store the cookie. If not specified, the cookie will
 * be stored for the session only.
 */
module.exports = function(name, value, days) {
  var options = {};

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    options.expires = date;
  }

  document.cookie = cookie.serialize(name, value, options);
};
