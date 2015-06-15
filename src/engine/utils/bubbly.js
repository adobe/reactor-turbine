var covertData = require('./covertData');
var matchesCSS = require('./dom/matchesCSS');

module.exports = function(pairings) {
  return function(event) {
    if (covertData(event, 'bubbly.eventProcessed')) {
      return;
    }

    var node = event.target;
    var childHasTriggeredRule = false;

    while (node) {
      var preventEvaluationOnAncestors = false;

      var nodeTriggeredRule = false;

      // Just because this could be processed a lot, we'll use a for loop instead of forEach.
      // Yay micro-optimizations!
      for (var i = 0; i < pairings.length; i++) {
        var pairing = pairings[i];

        if (!pairing.settings.bubbleFireIfChildFired && childHasTriggeredRule) {
          continue;
        }

        if ((node === event.target || pairing.settings.bubbleFireIfParent) &&
            matchesCSS(pairing.settings.selector, node)) {
          nodeTriggeredRule = true;
          pairing.trigger(event);

          // Note that bubbling is only stopped if the rule actually triggered!
          if (pairing.settings.bubbleStop) {
            preventEvaluationOnAncestors = true;
          }
        }

      };

      if (preventEvaluationOnAncestors) {
        break;
      }

      if (nodeTriggeredRule) {
        childHasTriggeredRule = true;
      }

      node = node.parentNode;
    }

    covertData(event, 'bubbly.eventProcessed', true);
  };
};
