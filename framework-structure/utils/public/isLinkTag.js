// `isLinkTag(thing)`
// ----------------
//
// Returns whether thing is a DOM link element
module.exports = function(thing){
  return !!(thing && thing.nodeName &&
  thing.nodeName.toLowerCase() === 'a');
};
