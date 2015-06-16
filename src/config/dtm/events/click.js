var bubbly = require('bubbly');
var addDynamicEventListener = require('addDynamicEventListener');

var clickBubbly = bubbly();

module.exports = function(trigger, settings) {
  clickBubbly.addListener(trigger, settings);

  if (settings.eventHandlerOnElement) {
    addDynamicEventListener(settings.selector, 'click', clickBubbly.evaluateEvent);
  } else {
    document.addEventListener('click', clickBubbly.evaluateEvent);
  }
};
