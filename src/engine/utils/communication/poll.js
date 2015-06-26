var isNumber = require('./../isType/isNumber');

// `poll(fn, [freq], [maxRetries])`
// ------------------
//
// Runs `fn` for every `freq` ms. `freq` defaults to 1000. If any
// invocation of `fn()` returns true, polling will stop.
// The polling will stop if the number or retries exceeds the
// provided `maxRetries`.
//
// Parameters:
//
// * `fn` - function to be called repeatedly
// * `freq` - frequency to call the function
// * `maxRetries` - number of times to retry
module.exports = function(fn, freq, maxRetries) {
  var retries = 0;

  freq = freq || 1000;

  function check() {
    if (isNumber(maxRetries) && retries++ >= maxRetries) {
      return;
    }

    if (!fn()) {
      setTimeout(check, freq);
    }
  }

  check();
};
