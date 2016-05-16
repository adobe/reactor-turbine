/**
 * Returns a proxy function that, when call the first time, will call a target function.
 * Subsequent calls will not call the target function.
 * @param {Function} fn That target function to call a single time.
 * @param {Object} [context] The context in which to call the target function.
 * @returns {Function}
 */
module.exports = function(fn, context) {
  var result;

  return function() {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = null;
    }

    return result;
  };
};
