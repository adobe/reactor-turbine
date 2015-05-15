// Check if attribute is defined on element
//
// Parameters:
//
// - `element` - the DOM element
// - `attrName` - attribute name
module.exports = function(element, attrName) {
  return element.hasAttribute ? element.hasAttribute(attrName) : element[attrName] !== undefined;
}
