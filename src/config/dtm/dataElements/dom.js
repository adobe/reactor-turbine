'use strict';

module.exports = function(settings) {
  var elements = document.querySelectorAll(settings.dataElementSettings.selector);
  if (elements.length > 0) {
    var element = elements[0];

    // TODO Can we use getObjectProperty() here or at least getElementText()?
    if (settings.dataElementSettings.property === 'text') {
      return element.innerText || element.textContent;
    } else if (element.hasAttribute(settings.dataElementSettings.property)) {
      return element.getAttribute(settings.dataElementSettings.property);
    }
  }
};
