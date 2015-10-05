/**
 * Determines whether an element is an anchor element.
 * @private
 * @param {HTMLElement} element
 * @returns {boolean}
 */
var isAnchor = function(element) {
  return !!(element && element.nodeName && element.nodeName.toLowerCase() === 'a');
};

/**
 * Determines if an element is an anchor element. If <code>searchAncestors</code> is true, this
 * will return whether this element is an anchor element or a descendant of an anchor element.
 * @param {HTMLElement} element The element to test.
 * @param {boolean} searchAncestors Whether to search ancestors for an anchor element.
 * @returns {boolean}
 */
module.exports = function(element, searchAncestors) {
  if (searchAncestors) {
    for (var current = element; current; current = current.parentNode) {
      if (isAnchor(current)) {
        return true;
      }
    }
    return false;
  } else {
    return isAnchor(element);
  }
};
