// `isArray(thing)`
// --------------
//
// Returns whether the given thing is an array.
module.exports = Array.isArray || function(thing) {
  return ToString.apply(thing) === "[object Array]";
};
