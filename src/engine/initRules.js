var forEach = require('./utils/array/forEach');
var preprocessSettings = require('./utils/preprocessSettings');

// TODO: Add a bunch of checks with error reporting.

module.exports = function(rules, extensionInstanceRegistry, eventDelegates, conditionDelegates) {
  function initEventDelegate(rule){
    if (rule.events){

      function trigger(eventDetail) {
        checkConditions(rule, eventDetail);
      }

      forEach(rule.events, function(event) {
        event.settings = event.settings || {};

        var delegate = eventDelegates.get(event.type);
        delegate(trigger, event.settings);
      });
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
      forEach(action.integrationIds, function(instanceId) {
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
