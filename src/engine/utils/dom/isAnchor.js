function isAnchor(thing) {
  return !!(thing && thing.nodeName && thing.nodeName.toLowerCase() === 'a');
}

module.exports = function(element, searchAncestors) {
  if (searchAncestors) {
    for (var cur = element; cur; cur = cur.parentNode) {
      if (isAnchor(cur)) {
        return true;
      }
    }
    return false;
  } else {
    return isAnchor(element);
  }
};
