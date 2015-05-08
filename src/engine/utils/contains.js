var indexOf = require('./indexOf');

// `contains(arr, obj)`
// -----------------------
//
// Tells you whether an array contains an object.
//
// Parameters:
//
// - `arr` - said array
// - `obj` - said object
module.exports = function(arr, obj){
  return indexOf(arr, obj) !== -1;
};
