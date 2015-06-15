var bubbly = require('bubbly');
var addDynamicEventListener = require('addDynamicEventListener');
var pairings = [];
var evaluateEvent = bubbly(pairings);

module.exports = function(trigger, settings) {
  var pairing = {
    settings: settings,
    trigger: trigger
  };

  pairings.push(pairing);

  if (settings.eventHandlerOnElement) {
    addDynamicEventListener(settings.selector, 'click', evaluateEvent);
  } else {
    document.addEventListener('click', evaluateEvent);
  }
};
