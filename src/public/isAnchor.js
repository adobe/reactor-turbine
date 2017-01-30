/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

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
