// `map(arr, func)`
// ----------------
//
// A handy method for mapping an array to another array using a 1-to-1 mapping
// for each element
//
// Parameters:
//
// Parameters are the same as `SL.each`, except that `func` is expected to return
// a the value you want in the corresponding index of the returned array.
module.exports = function(arr, func, context) {
  var ret = [];
  for (var i = 0, len = arr.length; i < len; i++)
    ret.push(func.call(context, arr[i], i, arr))
  return ret;
};
