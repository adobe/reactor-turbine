var addSelectorEventListener = require('addSelectorEventListener');

module.exports = function(trigger, eventSettings) {
  addSelectorEventListener(
    eventSettings.selector,
    'click',
    eventSettings.eventHandlerOnElement,
    trigger);
};
