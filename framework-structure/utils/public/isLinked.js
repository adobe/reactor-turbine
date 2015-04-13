// `isLinked(elm)`
// ---------------
//
// Returns whether the element is either an anchor or a descendant of an anchor or contains an anchor.
//
// `elm` - the element to test
var isLinkTag = require('./isLinkTag');

module.exports = function(elm){
  for (var cur = elm; cur; cur = cur.parentNode) {
    if (isLinkTag(cur))
      return true;
  }
  return false;
};
