var addSelectorEventListener = require('addSelectorEventListener');

module.exports = function(trigger, eventSettings) {
  addSelectorEventListener(
    eventSettings.selector,
    'mouseover',
    eventSettings.eventHandlerOnElement,
    trigger);
};
