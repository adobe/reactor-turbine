describe('onPageBottom', function() {
  var getInjectedOnPageBottom = function(window, document) {
    return require('inject!../onPageBottom')({
      'window': window,
      'document': document,
      './once': require('../once')
    });
  };

  it('calls the callback when `_satellite.pageBottom` is executed', function(done) {
    var windowFakeObject = {};
    var documentFakeObject = { addEventListener: function() {} };

    var onPageBottom = getInjectedOnPageBottom(windowFakeObject, documentFakeObject);

    onPageBottom(done);

    windowFakeObject._satellite.pageBottom();
  });

  it('calls the callback when DOMContentLoaded is executed', function(done) {
    var triggerDOMContentLoaded = null;

    var windowFakeObject = {};
    var documentFakeObject = {
      addEventListener: function(eventName, fn) {
        if (eventName === 'DOMContentLoaded') {
          triggerDOMContentLoaded = fn;
        }
      }
    };

    var onPageBottom = getInjectedOnPageBottom(windowFakeObject, documentFakeObject);

    onPageBottom(done);

    triggerDOMContentLoaded();
  });

  it('callback is called only once', function() {
    var triggerDOMContentLoaded = null;

    var windowFakeObject = {};
    var documentFakeObject = {
      addEventListener: function(eventName, fn) {
        if (eventName === 'DOMContentLoaded') {
          triggerDOMContentLoaded = fn;
        }
      }
    };

    var onPageBottom = getInjectedOnPageBottom(windowFakeObject, documentFakeObject);

    var spy = jasmine.createSpy();

    onPageBottom(spy);

    windowFakeObject._satellite.pageBottom();
    windowFakeObject._satellite.pageBottom();
    triggerDOMContentLoaded();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('calls callback even after pageBottom has occurred', function(done) {
    var windowFakeObject = {};
    var documentFakeObject = {
      addEventListener: function() {}
    };

    var onPageBottom = getInjectedOnPageBottom(windowFakeObject, documentFakeObject);

    windowFakeObject._satellite.pageBottom();

    onPageBottom(done);
  });
});
