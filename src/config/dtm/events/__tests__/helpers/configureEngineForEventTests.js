var config = _satellite.getConfig();

config.integrations = {
  'abc': {
    type: 'testExtension'
  }
};

config.coreDelegates = {
  testExtension: function(module, require) {
    module.exports = function() {
      return {
        test: function() {
        }
      };
    };
  }
};

config.rules = [];

/**
 * Configures an extension for the engine for testing event delegates. Calling this multiple
 * times will override configuration made by previous calls. It should really only be called once.
 * @param {Function} actionSpy An action spy. This will be called if a configured rule is triggered
 * and passes conditions.
 */
window.configureExtensionForEventTests = function(actionSpy) {
  config.coreDelegates.testExtension = function(module, require) {
    module.exports = function() {
      return {
        test: actionSpy
      };
    };
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
        settings: {
          script: conditionSpy || function() {
            return true;
          }
        }
      }
    ],
    actions: [
      {
        integrationIds: ['abc'],
        method: 'test'
      }
    ]
  });
};
