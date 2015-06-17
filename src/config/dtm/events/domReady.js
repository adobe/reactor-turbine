// `domReady(callback)`
// --------------------
//
// Registers a callback to be called when the DOM is fully parsed and loaded.
//
// Parameters:
//
// - `callback` - a function to be called at `domready`
//
// *domReady is borrowed from <https://github.com/ded/domready>*
var domReady = (function(ready) {

  var fns = [],
    fn, f = false,
    doc = document,
    testEl = doc.documentElement,
    hack = testEl.doScroll,
    domContentLoaded = 'DOMContentLoaded',
    addEventListener = 'addEventListener',
    onreadystatechange = 'onreadystatechange',
    loaded = /^loade|^c/.test(doc.readyState);

  function flush(f) {
    loaded = 1;
    while (f = fns.shift()) f();
  }

  doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function() {
    doc.removeEventListener(domContentLoaded, fn, f);
    flush();
  }, f);


  hack && doc.attachEvent(onreadystatechange, (fn = function() {
    if (/^c/.test(doc.readyState)) {
      doc.detachEvent(onreadystatechange, fn);
      flush();
    }
  }));

  return (ready = hack ?
    function(fn) {
      self != top ?
        loaded ? fn() : fns.push(fn) :
        function() {
          try {
            testEl.doScroll('left');
          } catch (e) {
            return setTimeout(function() {
              ready(fn);
            }, 50);
          }
          fn();
        }();
    } :
    function(fn) {
      loaded ? fn() : fns.push(fn);
    });
}());

module.exports = function(trigger) {
  domReady(function() {
    var pseudoEvent = {
      type: 'domready',
      target: document.location
    };

    trigger(pseudoEvent, document.location);
  });
};
