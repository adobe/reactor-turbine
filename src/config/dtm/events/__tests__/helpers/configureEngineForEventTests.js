'use strict';

var config = _satellite.getConfig();

config.extensions = {
  testExtension: {
    name: 'Test Extension'
  }
};

config.actionDelegates = {
  test: function(module) {
    module.exports = function() {};
  }
};

config.rules = [];

/**
 * Configures an action for the engine for testing event delegates. Calling this multiple
 * times will override configuration made by previous calls.
 * @param {Function} actionSpy An action spy. This will be called if a configured rule is triggered
 * and passes conditions.
 */
window.configureActionForEventTests = function(actionSpy) {
  config.actionDelegates.test = function(module) {
    module.exports = actionSpy;
  };
};

/**
 * Configures a rule for the engine for testing event delegates. Can be called multiple times to
 * set up multiple rules.
 * @param {Array} events An array of event configuration objects for the rule.
 * @param {Function} [conditionSpy] A condition spy.
 */
window.configureRuleForEventTests = function(events, conditionSpy) {
  config.rules.push({
    events: events, // This will vary amongst tests.
    conditions: [
      {
        type: 'dtm.custom',
        config: {
          script: conditionSpy || function() {
            return true;
          }
        }
      }
    ],
    actions: [
      {
        type: 'test'
      }
    ]
  });
};
