var preprocessConfig = require('./utils/preprocessConfig');
var logger = require('./utils/logger');
var state = require('./state');

function runActions(rule, event, relatedElement) {
  if (state.getShouldExecuteActions() && rule.actions) {
    rule.actions.forEach(function(action) {
      action.config = action.config || {};
      action.integrationIds = action.integrationIds || [];

      var delegate = state.getActionDelegate(action.type);

      if (!delegate) {
        logger.error('Action delegate of type ' + action.type + ' not found.');
        return;
      }

      var config = {
        actionConfig: preprocessConfig(action.config, relatedElement, event),
        integrationConfigs: action.integrationIds.map(state.getIntegrationConfigById),
        propertyConfig: state.getPropertyConfig()
      };

      try {
        delegate(config);
      } catch (e) {
        logger.error('Error when executing action for rule ' + rule.name);
        // Don't re-throw the error because we want to continue execution.
      }
    });
  }

  logger.log('Rule "' + rule.name + '" fired.');
}

function checkConditions(rule, event, relatedElement) {
  if (rule.conditions) {
    for (var i = 0; i < rule.conditions.length; i++) {
      var condition = rule.conditions[i];
      condition.config = condition.config || {};
      condition.integrationIds = condition.integrationIds || [];

      var delegate = state.getConditionDelegate(condition.type);

      if (!delegate) {
        logger.error('Condition delegate of type ' + condition.type + ' not found.');
        // Return because we want to assume the condition would have failed and therefore
        // we don't want to run the rule's actions.
        return;
      }

      var config = {
        conditionConfig: preprocessConfig(condition.config, relatedElement, event),
        integrationConfigs: condition.integrationIds.map(state.getIntegrationConfigById),
        propertyConfig: state.getPropertyConfig()
      };

      try {
        if (!delegate(config, event, relatedElement)) {
          logger.log('Condition for rule ' + rule.name + ' not met.');
          return;
        }
      } catch (e) {
        logger.error('Error when executing condition for rule ' + rule.name);
        // Don't re-throw the error because we want to continue execution. We do return
        // however because we want to assume the condition would have failed and therefore
        // we don't want to run the rule's actions.
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
      event.integrationIds = event.integrationIds || [];

      var delegate = state.getEventDelegate(event.type);

      if (!delegate) {
        logger.error('Event delegate of type ' + event.type + ' not found.');
        return;
      }

      var config = {
        eventConfig: preprocessConfig(event.config),
        integrationConfigs: event.integrationIds.map(state.getIntegrationConfigById),
        propertyConfig: state.getPropertyConfig()
      };

      try {
        delegate(config, trigger);
      } catch (e) {
        logger.error('Error when executing event listener for rule ' + rule.name);
        // Don't re-throw the error because we want to continue execution.
      }
    });
  }
}

module.exports = function() {
  state.getRules().forEach(function(rule) {
    initEventDelegate(rule);
  });
};

