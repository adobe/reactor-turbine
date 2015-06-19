// `indexOf(arr, obj)`
// -------------------
//
// Return the index of an object within an array.
//
// Parameters;
//
// - `arr` - said array
// - `obj` - said object
module.exports = function(arr, obj) {
  if (arr.indexOf) {
    return arr.indexOf(obj);
  }
  for (var i = arr.length; i--;)
    if (obj === arr[i]) {
      return i;
    }
  return -1;
};
