var replaceVarTokens = require('./utils/dataElement/replaceVarTokens');
var logger = require('./utils/logger');
var state = require('./state');

var runActions = function(rule, relatedElement, event) {
  if (state.getShouldExecuteActions() && rule.actions) {
    rule.actions.forEach(function(action) {
      action.settings = action.settings || {};

      var delegate = state.getDelegate(action.modulePath);

      if (!delegate.exports) {
        logger.error('Action delegate ' + action.modulePath + ' not found.');
        return;
      }

      var settings = replaceVarTokens(action.settings, relatedElement, event);

      try {
        delegate.exports(settings, relatedElement, event);
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

var checkConditions = function(rule, relatedElement, event) {
  if (rule.conditions) {
    for (var i = 0; i < rule.conditions.length; i++) {
      var condition = rule.conditions[i];
      condition.settings = condition.settings || {};

      var delegate = state.getDelegate(condition.modulePath);

      if (!delegate.exports) {
        logger.error('Condition delegate ' + condition.modulePath + ' not found.');
        // Return because we want to assume the condition would have failed and therefore
        // we don't want to run the rule's actions.
        return;
      }

      var settings = replaceVarTokens(condition.settings, relatedElement, event);

      try {
        if (!delegate.exports(settings, relatedElement, event)) {
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

  runActions(rule, relatedElement, event);
};

var initEventDelegate = function(rule) {
  if (rule.events) {
    /**
     * This is the callback that executes a particular rule when an event has occurred.
     * @callback ruleTrigger
     * @param {HTMLElement} [relatedElement] The element the rule targeted.
     * @param {Object} [event] An event object (native or synthetic) that contains detail
     * regarding the event that occurred.
     */
    var trigger = function(relatedElement, event) {
      checkConditions(rule, relatedElement, event);
    };

    rule.events.forEach(function(event) {
      event.settings = event.settings || {};

      var delegate = state.getDelegate(event.modulePath);

      if (!delegate.exports) {
        logger.error('Event delegate ' + event.modulePath + ' not found.');
        return;
      }

      var settings = replaceVarTokens(event.settings);

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

