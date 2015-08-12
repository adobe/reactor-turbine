var window = require('window');

/**
 * Retrieves a variable value from the current URL querystring.
 * @param name The name of the querystring parameter.
 * @param [caseInsensitive=false] Whether differences in parameter name casing should be ignored.
 * This does not change the value that is returned.
 * @returns {string}
 */
module.exports = function(name, caseInsensitive) {
  // We can't cache querystring values because they can be changed at any time with
  // the HTML5 History API.
  var match = new RegExp('[?&]' + name + '=([^&]*)', caseInsensitive ? 'i' : '')
      .exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
};
