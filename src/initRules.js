var replaceDataElementTokens = require('./utils/replaceDataElementTokens');
var logger = require('./utils/logger');
var state = require('./state');

var runActions = function(rule, event, relatedElement) {
  if (state.getShouldExecuteActions() && rule.actions) {
    rule.actions.forEach(function(action) {
      action.settings = action.settings || {};

      var delegate = state.getDelegate(action.delegateId);

      if (!delegate.exports) {
        logger.error('Action delegate ' + action.delegateId + ' not found.');
        return;
      }

      var settings = replaceDataElementTokens(action.settings, relatedElement, event);

      try {
        delegate.exports(settings);
      } catch (e) {
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
      condition.settings = condition.settings || {};

      var delegate = state.getDelegate(condition.delegateId);

      if (!delegate.exports) {
        logger.error('Condition delegate ' + condition.delegateId + ' not found.');
        // Return because we want to assume the condition would have failed and therefore
        // we don't want to run the rule's actions.
        return;
      }

      var settings = replaceDataElementTokens(condition.settings, relatedElement, event);

      try {
        if (!delegate.exports(settings, event, relatedElement)) {
          logger.log('Condition for rule ' + rule.name + ' not met.');
          return;
        }
      } catch (e) {
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
      event.settings = event.settings || {};

      var delegate = state.getDelegate(event.delegateId);

      if (!delegate.exports) {
        logger.error('Event delegate ' + event.delegateId + ' not found.');
        return;
      }

      var settings = replaceDataElementTokens(event.settings);

      try {
        delegate.exports(settings, trigger);
      } catch (e) {
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

