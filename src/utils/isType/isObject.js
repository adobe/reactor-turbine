var isArray = require('./isArray');

// `isObject(thing)`
// -----------------
//
// Returns whether the given thing is a plain object.
module.exports = function(thing) {
  return thing != null && !isArray(thing) &&
    typeof thing === 'object';
};
