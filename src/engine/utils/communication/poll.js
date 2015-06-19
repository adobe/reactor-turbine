var isNumber = require('./../isType/isNumber');

// `poll(fn, [freq], [max_retries])`
// ------------------
//
// Runs `fn` for every `freq` ms. `freq` defaults to 1000. If any
// invocation of `fn()` returns true, polling will stop.
// The polling will stop if the number or retries exceeds the
// provided `max_retries`.
//
// Parameters:
//
// * `fn` - function to be called repeatedly
// * `freq` - frequency to call the function
// * `max_retries` - number of times to retry
module.exports = function(fn, freq, max_retries) {
  var retries = 0;

  freq = freq || 1000;
  check();

  function check() {
    if (isNumber(max_retries) && retries++ >= max_retries) {
      return;
    }

    if (!fn()) {
      setTimeout(check, freq);
    }
  }
};
