/**
 * Returns whether an element matches a selector.
 * @param {HTMLElement} element The HTML element being tested.
 * @param {string} selector The CSS selector.
 * @returns {boolean}
 */
module.exports = (function(documentElement) {

  var simpleTagMatch = function(element, selector) {
    var tagName = element.tagName;
    if (!tagName) {
      return false;
    }
    return selector.toLowerCase() === tagName.toLowerCase();
  };

  var matches =
    documentElement.matchesSelector ||
    documentElement.mozMatchesSelector ||
    documentElement.webkitMatchesSelector ||
    documentElement.oMatchesSelector ||
    documentElement.msMatchesSelector;

  if (matches) {
    return function(element, selector) {
      if (element === document || element === window) {
        return false;
      }
      try {
        return matches.call(element, selector);
      } catch (e) {
        return false;
      }
    };
  } else {
    return function(element, selector) {
      var parent = element.parentNode;
      if (!parent) {
        return false;
      }
      if (selector.match(/^[a-z]+$/i)) {
        return simpleTagMatch(element, selector);
      }
      try {
        var nodeList = element.parentNode.querySelectorAll(selector);
        for (var i = nodeList.length; i--; ) {
          if (nodeList[i] === element) {
            return true;
          }
        }
      } catch (e) {
        //
      }
      return false;
    };
  }
}(document.documentElement));
