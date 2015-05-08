var addSelectorEventListener = require('addSelectorEventListener');

module.exports = function(trigger, settings) {
  addSelectorEventListener(
    settings.selector,
    'mouseover',
    settings.eventHandlerOnElement,
    trigger);
};
