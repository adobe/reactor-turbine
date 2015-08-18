'use strict';

var getCookie = require('getCookie');

/**
 * Cookie opt-out condition. Determines whether the user has chosen to accept cookies.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {boolean} [config.conditionConfig.acceptsCookies] If true, the condition will return
 * true if the user has chosen to accept cookies. If false, the condition will return true if the
 * user has chosen not to accept cookies. If the sat_track cookie has not been set, the condition
 * will return false regardless of the acceptsCookies value.
 * @returns {boolean}
 */
module.exports = function(config) {
  return getCookie('sat_track') === (config.conditionConfig.acceptsCookies ? 'true' : 'false');
};

