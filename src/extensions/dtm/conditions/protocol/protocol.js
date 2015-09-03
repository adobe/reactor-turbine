'use strict';

/**
 * Protocol condition. Determines if the actual protocol matches at least one acceptable
 * protocol.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {RegEx[]} config.conditionConfig.protocols An array of acceptable protocols.
 * @returns {boolean}
 */
module.exports = function(config) {
  var documentProtocol = document.location.protocol;

  return config.conditionConfig.protocols.some(function(protocol) {
    return documentProtocol.match(protocol);
  });
};

