'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Subdomain condition. Determines if the current location is an matching subdomain.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {(RegEx|string)[]} [config.conditionConfig.include] An array of subdomains. If specified,
 * the current domain must match at least one of the listed subdomains.
 * @param {(RegEx|string)[]} [config.conditionConfig.exclude] An array of subdomains. If specified,
 * the current domain must not match any of the listed subdomains.
 * @returns {boolean}
 */
module.exports = function(config) {
  var hostname = document.location.hostname;
  var include = config.conditionConfig.include;
  var exclude = config.conditionConfig.exclude;
  var foundMatch;

  if (include) {
    foundMatch = include.some(function(subdomain) {
      return textMatch(hostname, subdomain);
    });

    if (!foundMatch) {
      return false;
    }
  }

  if (exclude) {
    foundMatch = exclude.some(function(subdomain) {
      return textMatch(hostname, subdomain);
    });

    if (foundMatch) {
      return false;
    }
  }

  return true;
};

