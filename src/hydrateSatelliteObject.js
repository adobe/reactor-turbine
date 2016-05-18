var cookie = require('cookie');
var isAnchor = require('./utils/dom/isAnchor');
var state = require('./state');
var logger = require('./utils/logger');

module.exports = function() {
  // Will get replaced by the pageBottom event delegate. Exists here in case there are no page
  // bottom rules (and therefore the pageBottom event delegate won't get included) and our
  // customers are still calling the method.
  _satellite.pageBottom = function() {};

  // Will get replaced by the directCall event delegate. Exists here in case there are no direct
  // call rules (and therefore the directCall event delegate won't get included) and our customers
  // are still calling the method.
  _satellite.track = function() {};

  _satellite.buildInfo = state.getBuildInfo();
  _satellite.notify = logger.notify.bind(logger);
  _satellite.getVar = require('./utils/dataElement/getVar');
  _satellite.setVar = require('./utils/dataElement/setCustomVar');
// TODO: _satellite.getVisitorId

  /**
   * Writes a cookie.
   * @param {string} name The name of the cookie to save.
   * @param {string} value The value of the cookie to save.
   * @param {number} [days] The number of days to store the cookie. If not specified, the cookie
   * will be stored for the session only.
   */
  _satellite.setCookie = function(name, value, days) {
    logger.warn('This method is being deprecated. Please start using the `_satellite.cookie` API.');

    var options = {};

    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      options.expires = date;
    }

    document.cookie = cookie.serialize(name, value, options);
  };

  /**
   * Reads a cookie value.
   * @param {string} name The name of the cookie to read.
   * @returns {string}
   */
  _satellite.getCookie = _satellite.readCookie = function(name) {
    logger.warn('This method is being deprecated. Please start using the `_satellite.cookie` API.');

    return cookie.parse(document.cookie)[name];
  };

  /**
   * Removes a cookie value.
   * @param name
   */
  _satellite.removeCookie = function(name) {
    logger.warn('This method is being deprecated. Please start using the `_satellite.cookie` API.');

    _satellite.setCookie(name, '', -1);
  };

  _satellite.cookie = cookie;

  _satellite.isLinked = function(element) {
    return isAnchor(element, true);
  };

  _satellite.setDebug = function(value) {
    state.setDebugOuputEnabled(value);

    // TODO: Have state emit an event that logger listens to instead?
    logger.outputEnabled = value;
  };

  if (ENV_TEST) {
    _satellite.__test = {
      domContentLoadedHasFired: require('./utils/dom/hasDomContentLoaded')
    };
  }
};
