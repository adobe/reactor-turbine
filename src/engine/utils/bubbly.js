var covertData = require('./covertData');
var matchesCSS = require('./dom/matchesCSS');

var id = 0;

/**
 * Handles logic related to bubbling options provided for many event types.
 * @returns {{addListener: Function, evaluateEvent: Function}}
 */
module.exports = function() {
  var listeners = [];

  var eventProcessedDataKey = 'dtm.bubbly.eventProcessed.' + id++;

  return {
    /**
     * Register a config object that should be evaluated for an event to determine if a rule
     * should be executed. If it should be executed, the trigger function will be called.
     * @param {Object} config The event config object.
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
     * hierarchy should be executed.
     * @param {Event} event The event that has occurred.
     * @param {HTMLElement} event.target The HTML element where the event originated.
     */
    evaluateEvent: function(event) {
      // When an event is handled it is evaluated a single time but checks out which rules are
      // targeting elements starting at the target node and looking all the way up the element
      // hierarchy. This should only happen once regardless of how many listeners exist for the
      // event.
      if (covertData(event, eventProcessedDataKey)) {
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

          if ((node === event.target || listener.config.bubbleFireIfParent) &&
            matchesCSS(listener.config.selector, node)) {

            listener.callback(event, node);

            nodeTriggeredRule = true;

            // Note that bubbling is only stopped if the rule actually triggered!
            if (listener.config.bubbleStop) {
              preventEvaluationOnAncestors = true;
            }
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

      covertData(event, eventProcessedDataKey, true);
    }
  };
};
