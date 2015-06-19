// `bind(func, context)`
// ---------------------
//
// Binds a context permanently to a context. The returned function is a new function
// which - when called - will call the passed in function with `context` bound to it.
//
// Parameters:
//
// `func` - a function
// `context` - an object to be bound as the context of this function
module.exports = function(func, context) {
  return function() {
    return func.apply(context, arguments);
  };
};
