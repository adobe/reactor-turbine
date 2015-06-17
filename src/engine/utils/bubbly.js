var covertData = require('./covertData');
var matchesCSS = require('./dom/matchesCSS');

var id = 0;

/**
 * Handles logic related to bubbling options provided for many event types.
 * @returns {{addListener: Function, evaluateEvent: Function}}
 */
module.exports = function() {
  var rulePairings = [];

  var eventProcessedDataKey = 'dtm.bubbly.eventProcessed.' + id++;

  return {
    /**
     * Register a settings object that should be evaluated for an event to determine if a rule
     * should be executed. If it should be executed, the trigger function will be called.
     * @param {Function} trigger The trigger function that will execute the rule.
     * @param {Object} settings The event settings object.
     * @param {Boolean} [settings.bubbleFireIfParent=false] Whether the rule should fire if the event
     * originated from a descendant element.
     * @param {Boolean} [settings.bubbleFireIfChildFired=false] Whether the rule should fire if the
     * same event has already triggered a rule targeting a descendant element.
     * @param {Boolean} [settings.bubbleStop=false] Whether the event should not trigger rules on
     * ancestor elements.
     */
    addListener: function(trigger, settings) {
      rulePairings.push({
        trigger: trigger,
        settings: settings
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
        for (var i = 0; i < rulePairings.length; i++) {
          var rulePairing = rulePairings[i];

          if (!rulePairing.settings.bubbleFireIfChildFired && childHasTriggeredRule) {
            continue;
          }

          if ((node === event.target || rulePairing.settings.bubbleFireIfParent) &&
              matchesCSS(rulePairing.settings.selector, node)) {

            rulePairing.trigger(event);

            nodeTriggeredRule = true;

            // Note that bubbling is only stopped if the rule actually triggered!
            if (rulePairing.settings.bubbleStop) {
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
