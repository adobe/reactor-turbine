var preprocessConfig = require('./utils/preprocessConfig');
var logger = require('./utils/logger');
var state = require('./state');

var runActions = function(rule, event, relatedElement) {
  if (state.getShouldExecuteActions() && rule.actions) {
    rule.actions.forEach(function(action) {
      action.config = action.config || {};

      var delegateExports = state.getDelegateExports(action.delegateId);

      if (!delegateExports) {
        logger.error('Action delegate ' + action.delegateId + ' not found.');
        return;
      }

      var config = preprocessConfig(action.config, relatedElement, event);

      try {
        delegateExports(config);
      } catch (e) {
        var delegate = state.getDelegate(action.delegateId);
        var message = 'Error when executing ' + delegate.displayName + ' action for '
          + rule.name + ' rule. Error message: ' + e.message;

        logger.error(message);
        // Don't re-throw the error because we want to continue execution.
      }
    });
  }

  logger.log('Rule "' + rule.name + '" fired.');
};

var checkConditions = function(rule, event, relatedElement) {
  if (rule.conditions) {
    for (var i = 0; i < rule.conditions.length; i++) {
      var condition = rule.conditions[i];
      condition.config = condition.config || {};

      var delegateExports = state.getDelegateExports(condition.delegateId);

      if (!delegateExports) {
        logger.error('Condition delegate ' + condition.delegateId + ' not found.');
        // Return because we want to assume the condition would have failed and therefore
        // we don't want to run the rule's actions.
        return;
      }

      var config = preprocessConfig(condition.config, relatedElement, event);

      try {
        if (!delegateExports(config, event, relatedElement)) {
          logger.log('Condition for rule ' + rule.name + ' not met.');
          return;
        }
      } catch (e) {
        var delegate = state.getDelegate(condition.delegateId);
        var message = 'Error when executing ' + delegate.displayName + ' condition for '
          + rule.name + ' rule. Error message: ' + e.message;

        logger.error(message);
        // Don't re-throw the error because we want to continue execution. We do return
        // however because we want to assume the condition would have failed and therefore
        // we don't want to run the rule's actions.
        return;
      }
    }
  }

  runActions(rule, event, relatedElement);
};

var initEventDelegate = function(rule) {
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

      var delegateExports = state.getDelegateExports(event.delegateId);

      if (!delegateExports) {
        logger.error('Event delegate ' + event.delegateId + ' not found.');
        return;
      }

      var config = preprocessConfig(event.config);

      try {
        delegateExports(config, trigger);
      } catch (e) {
        var delegate = state.getDelegate(event.delegateId);
        var message = 'Error when executing ' + delegate.displayName + ' event for '
          + rule.name + ' rule. Error message: ' + e.message;

        logger.error(message);
        // Don't re-throw the error because we want to continue execution.
      }
    });
  }
};

module.exports = function() {
  state.getRules().forEach(function(rule) {
    initEventDelegate(rule);
  });
};

