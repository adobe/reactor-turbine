var createDataStash = require('./createDataStash');
var PROCESSED = 'processed';
var matchesCSS = require('./dom/matchesCSS');

/**
 * Handles logic related to bubbling options provided for many event types.
 *
 * @returns {{addListener: Function, evaluateEvent: Function}}
 */
module.exports = function() {
  var listeners = [];

  // It's important that a new data stash is created for each instance of bubbly in order to store
  // whether this particular bubbly instance has processed the event. More than one instance of
  // bubbly may process an event. No instance of bubbly should process an event more than once.
  var dataStash = createDataStash('bubbly');

  return {
    /**
     * Register a config object that should be evaluated for an event to determine if a rule
     * should be executed. If it should be executed, the callback function will be called.
     * @param {Object} config The event config object.
     * @param {string} selector The selector the rule is matching on.
     * @param {string} [type] If specified, the callback will only be called if the event's type
     * matches.
     * @param {boolean} [config.bubbleFireIfParent=false] Whether the rule should fire if the
     * event originated from a descendant element.
     * @param {boolean} [config.bubbleFireIfChildFired=false] Whether the rule should fire if the
     * same event has already triggered a rule targeting a descendant element.
     * @param {boolean} [config.bubbleStop=false] Whether the event should not trigger rules on
     * @param {Function} callback The function to be called when a matching event is seen.
     * ancestor elements.
     */
    addListener: function(config, callback) {
      listeners.push({
        config: config,
        callback: callback
      });
    },
    /**
     * Evaluate an event to determine if any rule targeting elements in the event target's DOM
     * hierarchy should be executed. Note that event.type is not inspected. This assumes that
     * all registered listeners care about this particular event type. Whether they
     * @param {Event} event The event that has occurred.
     * @param {HTMLElement} event.target The HTML element where the event originated.
     */
    evaluateEvent: function(event) {
      if (!listeners.length) {
        return;
      }

      // When an event is handled it is evaluated a single time but checks out which rules are
      // targeting elements starting at the target node and looking all the way up the element
      // hierarchy. This should only happen once regardless of how many listeners exist for the
      // event.
      if (dataStash(event, PROCESSED)) {
        return;
      }

      var node = event.target;
      var childHasTriggeredRule = false;

      // Loop through from the event target up through the hierarchy evaluating each node
      // to see if it matches any rules.
      while (node) {
        var preventEvaluationOnAncestors = false;

        var nodeTriggeredRule = false;

        // Just because this could be processed a lot, we'll use a for loop instead of forEach.
        for (var i = 0; i < listeners.length; i++) {
          var listener = listeners[i];

          if (!listener.config.bubbleFireIfChildFired && childHasTriggeredRule) {
            continue;
          }

          if (node !== event.target && !listener.config.bubbleFireIfParent) {
            continue;
          }

          if (listener.config.type !== undefined && listener.config.type !== event.type) {
            continue;
          }

          if (!matchesCSS(listener.config.selector, node)) {
            continue;
          }

          listener.callback(event, node);

          nodeTriggeredRule = true;

          // Note that bubbling is only stopped if the rule actually triggered!
          if (listener.config.bubbleStop) {
            preventEvaluationOnAncestors = true;
          }
        }

        if (preventEvaluationOnAncestors) {
          break;
        }

        if (nodeTriggeredRule) {
          childHasTriggeredRule = true;
        }

        node = node.parentNode;
      }

      dataStash(event, PROCESSED, true);
    }
  };
};
