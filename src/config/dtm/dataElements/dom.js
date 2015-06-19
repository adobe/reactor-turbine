var elementHasAttribute = require('elementHasAttribute');

module.exports = function(settings) {
  var elements = document.querySelectorAll(settings.selector);
  if (elements.length > 0) {
    var element = elements[0];

    // TODO Can we use getObjectProperty() here or at least getElementText()?
    if (settings.property === 'text') {
      return element.innerText || element.textContent;
    } else if (elementHasAttribute(element, settings.property)) {
      return element[settings.property] || element.getAttribute(settings.property);
    }
  }
};
