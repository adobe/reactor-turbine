/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

var cookie = require('cookie');
var logger = require('./logger');
var prefixedLogger = logger.createPrefixedLogger('Custom Script');

module.exports = function(buildInfo, setDebugOutputEnabled) {
  // Will get replaced by the directCall event delegate from the DTM extension. Exists here in
  // case there are no direct call rules (and therefore the directCall event delegate won't get
  // included) and our customers are still calling the method. In this case, we don't want an error
  // to be thrown.
  _satellite.track = function() {};

  // Will get replaced by the Marketing Cloud ID extension if installed. Exists here in case
  // the extension is not installed and our customers are still calling the method. In this case,
  // we don't want an error to be thrown. This method existed before Reactor.
  _satellite.getVisitorId = function() { return null; };

  _satellite.buildInfo = buildInfo;

  _satellite.logger = prefixedLogger;

  /**
   * Log a message. We keep this due to legacy baggage.
   * @param {string} message The message to log.
   * @param {number} [level] A number that represents the level of logging.
   * 3=info, 4=warn, 5=error, anything else=log
   */
  _satellite.notify = function(message, level) {
    logger.warn('_satellite.notify is deprecated. Please use the `_satellite.logger` API.');

    switch (level) {
      case 3:
        prefixedLogger.info(message);
        break;
      case 4:
        prefixedLogger.warn(message);
        break;
      case 5:
        prefixedLogger.error(message);
        break;
      default:
        prefixedLogger.log(message);
    }
  };

  _satellite.getVar = require('./getVar');
  _satellite.setVar = require('./public/setCustomVar');

  /**
   * Writes a cookie.
   * @param {string} name The name of the cookie to save.
   * @param {string} value The value of the cookie to save.
   * @param {number} [days] The number of days to store the cookie. If not specified, the cookie
   * will be stored for the session only.
   */
  _satellite.setCookie = function(name, value, days) {
    logger.warn('_satellite.setCookie is deprecated. Please use the `_satellite.cookie` API.');

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
    logger.warn('_satellite.getCookie is deprecated. Please use the `_satellite.cookie` API.');

    return cookie.parse(document.cookie)[name];
  };

  /**
   * Removes a cookie value.
   * @param name
   */
  _satellite.removeCookie = function(name) {
    logger.warn('_satellite.removeCookie is deprecated. Please use the `_satellite.cookie` API.');

    _satellite.setCookie(name, '', -1);
  };

  _satellite.cookie = cookie;

  _satellite.setDebug = function(value) {
    setDebugOutputEnabled(value);

    // TODO: Have state emit an event that logger listens to instead?
    logger.outputEnabled = value;
  };
};
