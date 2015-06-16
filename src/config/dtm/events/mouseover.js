var bubbly = require('bubbly');
var addDynamicEventListener = require('addDynamicEventListener');

var mouseoverBubbly = bubbly();

module.exports = function(trigger, settings) {
  mouseoverBubbly.addListener(trigger, settings);

  if (settings.eventHandlerOnElement) {
    addDynamicEventListener(settings.selector, 'mouseover', mouseoverBubbly.evaluateEvent);
  } else {
    document.addEventListener('mouseover', mouseoverBubbly.evaluateEvent);
  }
};
