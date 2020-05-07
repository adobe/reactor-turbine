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

var cookie = require('@adobe/reactor-cookie');
var logger = require('./logger');

module.exports = function (
  _satellite,
  container,
  setDebugEnabled,
  getVar,
  setCustomVar
) {
  var customScriptPrefixedLogger = logger.createPrefixedLogger('Custom Script');

  // Will get replaced by the directCall event delegate from the Core extension. Exists here in
  // case there are no direct call rules (and therefore the directCall event delegate won't get
  // included) and our customers are still calling the method. In this case, we don't want an error
  // to be thrown. This method existed before Reactor.
  _satellite.track = function (identifier) {
    logger.log(
      '"' + identifier + '" does not match any direct call identifiers.'
    );
  };

  // Will get replaced by the Marketing Cloud ID extension if installed. Exists here in case
  // the extension is not installed and our customers are still calling the method. In this case,
  // we don't want an error to be thrown. This method existed before Reactor.
  _satellite.getVisitorId = function () {
    return null;
  };

  // container.property also has property settings, but it shouldn't concern the user.
  // By limiting our API exposure to necessities, we provide more flexibility in the future.
  _satellite.property = {
    name: container.property.name
  };

  _satellite.company = container.company;

  _satellite.buildInfo = container.buildInfo;

  _satellite.logger = customScriptPrefixedLogger;

  /**
   * Log a message. We keep this due to legacy baggage.
   * @param {string} message The message to log.
   * @param {number} [level] A number that represents the level of logging.
   * 3=info, 4=warn, 5=error, anything else=log
   */
  _satellite.notify = function (message, level) {
    logger.warn(
      '_satellite.notify is deprecated. Please use the `_satellite.logger` API.'
    );

    switch (level) {
      case 3:
        customScriptPrefixedLogger.info(message);
        break;
      case 4:
        customScriptPrefixedLogger.warn(message);
        break;
      case 5:
        customScriptPrefixedLogger.error(message);
        break;
      default:
        customScriptPrefixedLogger.log(message);
    }
  };

  _satellite.getVar = getVar;
  _satellite.setVar = setCustomVar;

  /**
   * Writes a cookie.
   * @param {string} name The name of the cookie to save.
   * @param {string} value The value of the cookie to save.
   * @param {number} [days] The number of days to store the cookie. If not specified, the cookie
   * will be stored for the session only.
   */
  _satellite.setCookie = function (name, value, days) {
    var optionsStr = '';
    var options = {};

    if (days) {
      optionsStr = ', { expires: ' + days + ' }';
      options.expires = days;
    }

    var msg =
      '_satellite.setCookie is deprecated. Please use ' +
      '_satellite.cookie.set("' +
      name +
      '", "' +
      value +
      '"' +
      optionsStr +
      ').';

    logger.warn(msg);
    cookie.set(name, value, options);
  };

  /**
   * Reads a cookie value.
   * @param {string} name The name of the cookie to read.
   * @returns {string}
   */
  _satellite.readCookie = function (name) {
    logger.warn(
      '_satellite.readCookie is deprecated. ' +
        'Please use _satellite.cookie.get("' +
        name +
        '").'
    );
    return cookie.get(name);
  };

  /**
   * Removes a cookie value.
   * @param name
   */
  _satellite.removeCookie = function (name) {
    logger.warn(
      '_satellite.removeCookie is deprecated. ' +
        'Please use _satellite.cookie.remove("' +
        name +
        '").'
    );
    cookie.remove(name);
  };

  _satellite.cookie = cookie;

  // Will get replaced by the pageBottom event delegate from the Core extension. Exists here in
  // case the customers are not using core (and therefore the pageBottom event delegate won't get
  // included) and they are still calling the method. In this case, we don't want an error
  // to be thrown. This method existed before Reactor.
  _satellite.pageBottom = function () {};

  _satellite.setDebug = setDebugEnabled;

  var warningLogged = false;

  Object.defineProperty(_satellite, '_container', {
    get: function () {
      if (!warningLogged) {
        logger.warn(
          '_satellite._container may change at any time and should only ' +
            'be used for debugging.'
        );
        warningLogged = true;
      }

      return container;
    }
  });
};
