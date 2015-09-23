/**
 * Returns whether an element matches a selector.
 * @param {HTMLElement} element The HTML element being tested.
 * @param {string} selector The CSS selector.
 * @returns {boolean}
 */
module.exports = (function(docEl) {

  function simpleTagMatch(elm, selector) {
    var tagName = elm.tagName;
    if (!tagName) {
      return false;
    }
    return selector.toLowerCase() === tagName.toLowerCase();
  }

  var matches =
    docEl.matchesSelector ||
    docEl.mozMatchesSelector ||
    docEl.webkitMatchesSelector ||
    docEl.oMatchesSelector ||
    docEl.msMatchesSelector;
  if (matches) {
    return function(elm, selector) {
      if (elm === document || elm === window) {
        return false;
      }
      try {
        return matches.call(elm, selector);
      } catch (e) {
        return false;
      }
    };
  } else {
    return function(elm, selector) {
      var parent = elm.parentNode;
      if (!parent) {
        return false;
      }
      if (selector.match(/^[a-z]+$/i)) {
        return simpleTagMatch(elm, selector);
      }
      try {
        var nodeList = elm.parentNode.querySelectorAll(selector);
        for (var i = nodeList.length; i--; ) {
          if (nodeList[i] === elm) {
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
