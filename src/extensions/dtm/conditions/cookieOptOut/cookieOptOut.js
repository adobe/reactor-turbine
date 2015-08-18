'use strict';

var getCookie = require('getCookie');

/**
 * Cookie opt-out condition. Determines whether the user has chosen to accept cookies.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {boolean} config.conditionConfig.acceptsCookies If true, the condition will return
 * true if the user has chosen to accept cookies. If false, the condition will return true if the
 * user has chosen not to accept cookies. If the sat_track cookie has not been set, the condition
 * will return false regardless of the acceptsCookies value.
 * @param {Object} config.propertyConfig Property config.
 * @param {string} [config.propertyConfig.euCookieName] The name of the cookie used for tracking
 * whether users have chosen to accept cookies.
 * @returns {boolean}
 */
module.exports = function(config) {
  // TODO: In the previous engine we were always using the "sat_track" cookie name which seemed
  // like a bug (https://jira.corp.adobe.com/browse/DTM-6611).
  // Is this the right thing to be doing now?
  var cookieName = config.propertyConfig.euCookieName === undefined ?
      'sat_track' : config.propertyConfig.euCookieName;
  return getCookie(cookieName) === (config.conditionConfig.acceptsCookies ? 'true' : 'false');
};

