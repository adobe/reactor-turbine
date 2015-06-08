window.initEventEngineConfig = function(ruleEvents, actionSpy, conditionSpy) {
  var config = _satellite.getConfig();

  config.extensionInstances = {
    'abc': {
      type: 'testExtension'
    }
  };

  config.coreDelegates = {
    testExtension: function(module, require) {
      module.exports = function() {
        return {
          test: actionSpy || function() {}
        };
      };
    }
  };

  config.rules = [
    {
      events: null, // This will vary amongst tests.
      conditions: [
        {
          type: 'dtm.custom',
          settings: {
            script: conditionSpy || function() { return true; }
          }
        }
      ],
      actions: [
        {
          extensionInstanceIds: ['abc'],
          method: 'test'
        }
      ]
    }
  ];

  config.rules[0].events = ruleEvents;
};
