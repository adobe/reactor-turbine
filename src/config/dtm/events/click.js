var addSelectorEventListener = require('addSelectorEventListener');

module.exports = function(trigger, settings) {
  addSelectorEventListener(
    settings.selector,
    'click',
    settings.eventHandlerOnElement,
    trigger);
};
