// Check if attribute is defined on element
//
// Parameters:
//
// - `elem` - the DOM element
// - `attrName` - attribute name
module.exports = function(elem, attrName) {
  return elem.hasAttribute ? elem.hasAttribute(attrName) : elem[attrName] !== undefined;
}
