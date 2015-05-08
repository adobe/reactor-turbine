var forEach = require('./utils/forEach');
var preprocessSettings = require('./utils/preprocessSettings');

// TODO: Add a bunch of checks with error reporting.

module.exports = function(rules, extensionInstanceRegistry, eventDelegates, conditionDelegates) {
  function initEventDelegate(rule){
    if (rule.event){
      rule.event.settings = rule.event.settings || {};

      function trigger(eventDetail) {
        checkConditions(rule, eventDetail);
      }

      var delegate = eventDelegates.get(rule.event.type);
      delegate(trigger, rule.event.settings);
    }
  }

  function checkConditions(rule, eventDetail) {
    if (rule.conditions) {
      for (var i = 0; i < rule.conditions.length; i++) {
        var condition = rule.conditions[i];
        condition.settings = condition.settings || {};

        var delegate = conditionDelegates.get(condition.type);
        if (!delegate(condition.settings, eventDetail)) {
          return;
        }
      }
    }

    runActions(rule, eventDetail);
  }

  function runActions(rule, eventDetail){
    forEach(rule.actions, function(action) {
      action.settings = action.settings || {};
      forEach(action.extensionInstanceIds, function(instanceId) {
        // TODO: Pass related element? Pass forceLowerCase?
        var preprocessedSettings = preprocessSettings(action.settings, null, eventDetail, false);
        extensionInstanceRegistry
          .getById(instanceId)
          .then(function(instance) {
            instance[action.method](preprocessedSettings);
          });
      });
    });
  }

  forEach(rules, function(rule){
    initEventDelegate(rule);
  });
};
