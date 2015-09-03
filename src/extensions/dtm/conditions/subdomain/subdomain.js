'use strict';

var textMatch = require('textMatch');
var document = require('document');

/**
 * Subdomain condition. Determines if the actual subdomain matches at least one acceptable subdomain
 * and does not match any unacceptable subdomain.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {(RegEx|string)[]} [config.conditionConfig.include] An array of acceptable subdomains.
 * @param {(RegEx|string)[]} [config.conditionConfig.exclude] An array of unacceptable subdomains.
 * @returns {boolean}
 */
module.exports = function(config) {
  var hostname = document.location.hostname;
  var include = config.conditionConfig.include;
  var exclude = config.conditionConfig.exclude;

  var compare = function(subdomainOption) {
    return textMatch(hostname, subdomainOption);
  };

  return (!include || include.some(compare)) && (!exclude || !exclude.some(compare));
};

