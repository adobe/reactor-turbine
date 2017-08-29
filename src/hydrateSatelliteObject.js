/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

var cookie = require('cookie');
var logger = require('./logger');
var prefixedLogger = logger.createPrefixedLogger('Custom Script');

module.exports = function(buildInfo, setDebugOutputEnabled) {
  // Will get replaced by the directCall event delegate from the DTM extension. Exists here in
  // case there are no direct call rules (and therefore the directCall event delegate won't get
  // included) and our customers are still calling the method. In this case, we don't want an error
  // to be thrown. This method existed before Reactor.
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
    logger.warn('_satellite.readCookie is deprecated. Please use the `_satellite.cookie` API.');

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
