var forEach = require('./utils/forEach');
var preprocessSettings = require('./utils/preprocessSettings');
var publicRequire = require('./publicRequire');

var eventDelegatesByType = {};
var conditionDelegatesByType = {};

// TODO: Add a bunch of checks with error reporting.

module.exports = function(propertyMeta, extensionInstanceRegistry) {
  function initEventDelegate(rule){
    if (rule.event){
      rule.event.settings = rule.event.settings || {};

      var delegate = eventDelegatesByType[rule.event.type];

      if (!delegate) {
        var script = propertyMeta.eventDelegates[rule.event.type];
        var module = {};
        script(module, publicRequire);
        delegate = eventDelegatesByType[rule.event.type] = module.exports;
      }

      function trigger(eventDetail) {
        checkConditions(rule, eventDetail);
      }

      delegate(trigger, rule.event.settings);
    }
  }

  function checkConditions(rule, eventDetail) {
    if (rule.conditions) {
      for (var i = 0; i < rule.conditions.length; i++) {
        var condition = rule.conditions[i];
        condition.settings = condition.settings || {};

        var delegate = conditionDelegatesByType[condition.type];

        if (!delegate) {
          var script = propertyMeta.conditionDelegates[condition.type];
          var module = {};
          script(module, publicRequire);
          delegate = conditionDelegatesByType[condition.type] = module.exports;
        }

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

  forEach(propertyMeta.rules, function(rule){
    initEventDelegate(rule);
  });
};
