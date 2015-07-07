'use strict';

module.exports = function(config) {
  var elements = document.querySelectorAll(config.dataElementConfig.selector);
  if (elements.length > 0) {
    var element = elements[0];

    // TODO Can we use getObjectProperty() here or at least getElementText()?
    if (config.dataElementConfig.property === 'text') {
      return element.innerText || element.textContent;
    } else if (element.hasAttribute(config.dataElementConfig.property)) {
      return element.getAttribute(config.dataElementConfig.property);
    }
  }
};
