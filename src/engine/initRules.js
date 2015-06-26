var preprocessSettings = require('./utils/preprocessSettings');

// TODO: Add a bunch of checks with error reporting.

module.exports = function(rules, propertySettings, integrationRegistry,
      eventDelegates, conditionDelegates) {
  function runActions(rule, event, relatedElement) {
    rule.actions.forEach(function(action) {
      action.settings = action.settings || {};
      action.integrationIds.forEach(function(integrationId) {
        var preprocessedSettings = preprocessSettings(
          action.settings,
          propertySettings.undefinedVarsReturnEmpty,
          relatedElement,
          event);
        integrationRegistry
          .getById(integrationId)
          .then(function(instance) {
            instance[action.method](preprocessedSettings);
          });
      });
    });
  }

  function checkConditions(rule, event, relatedElement) {
    if (rule.conditions) {
      for (var i = 0; i < rule.conditions.length; i++) {
        var condition = rule.conditions[i];
        condition.settings = condition.settings || {};

        var delegate = conditionDelegates.get(condition.type);
        if (!delegate(condition.settings, event, relatedElement)) {
          return;
        }
      }
    }

    runActions(rule, event, relatedElement);
  }

  function initEventDelegate(rule) {
    if (rule.events) {

      var trigger = function(event, relatedElement) {
        checkConditions(rule, event, relatedElement);
      };

      rule.events.forEach(function(event) {
        event.settings = event.settings || {};

        var delegate = eventDelegates.get(event.type);
        delegate(trigger, event.settings);
      });
    }
  }

  rules.forEach(function(rule) {
    initEventDelegate(rule);
  });
};

/**
 * This is the callback that executes a particular rule when an event has occurred.
 * @callback ruleTrigger
 * @param {Object} [event] An event object (native or synthetic) that contains detail regarding
 * the event that occurred.
 * @param {HTMLElement} [relatedElement] The element the rule targeted.
 */
