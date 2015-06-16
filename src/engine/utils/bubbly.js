var covertData = require('./covertData');
var matchesCSS = require('./dom/matchesCSS');

module.exports = function() {
  var rulePairings = [];

  return {
    addListener: function(trigger, settings) {
      rulePairings.push({
        trigger: trigger,
        settings: settings
      });
    },
    evaluateEvent: function(event) {
      // When an event is handled it is evaluated a single time but checks out which rules are
      // targeting elements starting at the target node and looking all the way up the element
      // hierarchy. This should only happen once regardless of how many listeners exist for the
      // event.
      if (covertData(event, 'bubbly.eventProcessed')) {
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

      covertData(event, 'bubbly.eventProcessed', true);
    }
  };
};
