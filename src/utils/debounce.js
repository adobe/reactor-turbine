/**
 * Debounce function. Returns a proxy function that, when called multiple times, will only execute
 * the target function after a certain delay has passed without the proxy function being called
 * again.
 * @param {Function} fn The target function to call once the delay period has passed.
 * @param {Number} delay The number of milliseconds that must pass before the target function is
 * called.
 * @param {Object} [context] The context in which to call the target function.
 * @returns {Function}
 */
module.exports = function(fn, delay, context) {
  var timeoutId = null;
  return function() {
    var ctx = this || context;
    var args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
      fn.apply(ctx, args);
    }, delay);
  };
};
