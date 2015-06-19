// `forEach(arr, func, [context])`
// ------------------
//
// A handy method for array iteration wo having to write a for-loop.
//
// Parameters:
//
// - `arr` - an array
// - `func(item, index, arr)` - a function which accepts each item in the array
//      once. I takes these arguments
//      * `item` - an item
//      * `index` - the array index of said item
//      * `arr` - the array
// - `context` - the context to be bound to `func` when it is invoked
module.exports = function(arr, func, context) {
  for (var i = 0, len = arr.length; i < len; i++)
    func.call(context, arr[i], i, arr)
};
