'use strict';

/**
 * Protocol condition. Determines if the browser is using the specified protocol.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {RegEx[]} config.conditionConfig.protocols An array of possible protocols. The current
 * browser protocol must match one of the entries in order for the condition to pass.
 * @returns {boolean}
 */
module.exports = function(config) {
  var documentProtocol = document.location.protocol;

  return config.conditionConfig.protocols.some(function(protocol) {
    return documentProtocol.match(protocol);
  });
};

