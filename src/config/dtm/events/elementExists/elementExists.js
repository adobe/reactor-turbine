var poll = require('poll');
var forEach = require('forEach');
var bubbly = require('bubbly');
var covertData = require('covertData');

var elementExistsBubbly = bubbly();
var completeDataKey = 'dtm.elementExists.complete';

var selectors = [];

poll('element exists event delegate', function() {
  for (var i = 0; i < selectors.length; i++) {
    var selector = selectors[i];
    var element = document.querySelector(selector);

    if (element) {
      // If the element has been seen before, bubbly will have already run all rules that apply
      // to it.
      if (!covertData(element, completeDataKey)) {
        elementExistsBubbly.evaluateEvent({
          type: 'elementexists',
          target: element
        });
        covertData(element, completeDataKey, true);
      }

      // No need to keep watching for the selector.
      // While we could use a reverse loop to enable us to splice the array safely, we don't
      // because all other DTM event types execute rules in the order they were registered and we
      // like to be consistent.
      selectors.splice(i--, 1);
    }
  }
});

module.exports = function(trigger, settings) {
  elementExistsBubbly.addListener(settings, trigger);

  if (selectors.indexOf(settings.selector) === -1) {
    selectors.push(settings.selector);
  }
};
