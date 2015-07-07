var _preprocessSettings = require('./utils/preprocessSettings');

// TODO: Add a bunch of checks with error reporting.

module.exports = function(property, eventDelegates, conditionDelegates, actionDelegates) {

  function preprocessSettings(settings, relatedElement, event) {
    return _preprocessSettings(
      settings,
      property.settings.undefinedVarsReturnEmpty,
      relatedElement,
      event
    );
  }

  function getPreprocessedIntegrationsSettings(integrationIds) {
    var integrationsSettings;

    if (integrationIds) {
      integrationsSettings = integrationIds.map(function(integrationId) {
        return preprocessSettings(property.integrations[integrationId]);
      });
    } else {
      integrationsSettings = [];
    }

    return integrationsSettings;
  }


  function runActions(rule, event, relatedElement) {
    if (rule.actions) {
      rule.actions.forEach(function(action) {
        action.settings = action.settings || {};

        var delegate = actionDelegates.get(action.type);

        var settings = {
          actionSettings: preprocessSettings(action.settings, relatedElement, event),
          integrationSettings: getPreprocessedIntegrationsSettings(action.integrationIds),
          propertySettings: preprocessSettings(property.settings)
        };

        delegate(settings);
      });
    }
  }

  function checkConditions(rule, event, relatedElement) {
    if (rule.conditions) {
      for (var i = 0; i < rule.conditions.length; i++) {
        var condition = rule.conditions[i];
        condition.settings = condition.settings || {};

        var delegate = conditionDelegates.get(condition.type);

        var settings = {
          conditionSettings: preprocessSettings(condition.settings, relatedElement, event),
          integrationsSettings: getPreprocessedIntegrationsSettings(condition.integrationIds),
          propertySettings: preprocessSettings(property.settings)
        };

        if (!delegate(settings, event, relatedElement)) {
          return;
        }
      }
    }

    runActions(rule, event, relatedElement);
  }

  function initEventDelegate(rule) {
    if (rule.events) {
      /**
       * This is the callback that executes a particular rule when an event has occurred.
       * @callback ruleTrigger
       * @param {Object} [event] An event object (native or synthetic) that contains detail regarding
       * the event that occurred.
       * @param {HTMLElement} [relatedElement] The element the rule targeted.
       */
      var trigger = function(event, relatedElement) {
        checkConditions(rule, event, relatedElement);
      };

      rule.events.forEach(function(event) {
        event.settings = event.settings || {};

        var delegate = eventDelegates.get(event.type);

        var settings = {
          eventSettings: preprocessSettings(event.settings),
          integrationsSettings: getPreprocessedIntegrationsSettings(event.integrationIds),
          propertySettings: preprocessSettings(property.settings)
        };

        delegate(settings, trigger);
      });
    }
  }

  property.rules.forEach(function(rule) {
    initEventDelegate(rule);
  });
};

