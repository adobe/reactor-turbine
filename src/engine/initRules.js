var preprocessConfig = require('./utils/preprocessConfig');

// TODO: Add a bunch of checks with error reporting.

module.exports = function(
    container, eventDelegates, conditionDelegates, actionDelegates, actionsEnabled) {

  function getPreprocessedIntegrationConfigs(integrationIds) {
    var integrationConfigs;

    if (integrationIds) {
      integrationConfigs = integrationIds.map(function(integrationId) {
        return preprocessConfig(container.integrations[integrationId].config);
      });
    } else {
      integrationConfigs = [];
    }

    return integrationConfigs;
  }


  function runActions(rule, event, relatedElement) {
    if (actionsEnabled && rule.actions) {
      rule.actions.forEach(function(action) {
        action.config = action.config || {};

        var delegate = actionDelegates.get(action.type);

        if (!delegate) {
          throw new Error('Action delegate of type ' + action.type + ' not found.');
        }

        var config = {
          actionConfig: preprocessConfig(action.config, relatedElement, event),
          integrationConfigs: getPreprocessedIntegrationConfigs(action.integrationIds),
          propertyConfig: preprocessConfig(container.config)
        };

        delegate(config);
      });
    }
  }

  function checkConditions(rule, event, relatedElement) {
    if (rule.conditions) {
      for (var i = 0; i < rule.conditions.length; i++) {
        var condition = rule.conditions[i];
        condition.config = condition.config || {};

        var delegate = conditionDelegates.get(condition.type);

        if (!delegate) {
          throw new Error('Condition delegate of type ' + condition.type + ' not found.');
        }

        var config = {
          conditionConfig: preprocessConfig(condition.config, relatedElement, event),
          integrationConfigs: getPreprocessedIntegrationConfigs(condition.integrationIds),
          propertyConfig: preprocessConfig(container.config)
        };

        if (!delegate(config, event, relatedElement)) {
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
       * @param {Object} [event] An event object (native or synthetic) that contains detail
       * regarding the event that occurred.
       * @param {HTMLElement} [relatedElement] The element the rule targeted.
       */
      var trigger = function(event, relatedElement) {
        checkConditions(rule, event, relatedElement);
      };

      rule.events.forEach(function(event) {
        event.config = event.config || {};

        var delegate = eventDelegates.get(event.type);

        if (!delegate) {
          throw new Error('Event delegate of type ' + event.type + ' not found.');
        }

        var config = {
          eventConfig: preprocessConfig(event.config),
          integrationConfigs: getPreprocessedIntegrationConfigs(event.integrationIds),
          propertyConfig: preprocessConfig(container.config)
        };

        delegate(config, trigger);
      });
    }
  }

  container.rules.forEach(function(rule) {
    initEventDelegate(rule);
  });
};

