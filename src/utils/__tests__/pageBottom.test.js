describe('pageBottom', function() {
  it('returns a promise', function() {
    var pageBottom = require('../pageBottom');

    expect(pageBottom.then).toEqual(jasmine.any(Function));
    expect(pageBottom.catch).toEqual(jasmine.any(Function));
  });

  it('fulfills the promise when `_satellite.pageBottom` is executed', function(done) {
    var pageBottomInjector = require('inject!../pageBottom');
    var  windowFakeObject = {};
    var  documentFakeObject = { addEventListener: function() {} };

    var pageBottom = pageBottomInjector({
      'window': windowFakeObject,
      'document': documentFakeObject
    });

    pageBottom.then(done);

    windowFakeObject._satellite.pageBottom();
  });

  it('fulfills the promise when DOMContentLoaded is executed', function(done) {
    var pageBottomInjector = require('inject!../pageBottom');
    var callback = null;

    var  windowFakeObject = {};
    var  documentFakeObject = {
      addEventListener: function(eventName, fn) {
        if (eventName === 'DOMContentLoaded') {
          callback = fn;
        }
      }
    };

    var pageBottom = pageBottomInjector({
      'window': windowFakeObject,
      'document': documentFakeObject
    });

    pageBottom.then(done);

    callback();
  });

  it('promise is fullfilled only once', function(done) {
    var pageBottomInjector = require('inject!../pageBottom');
    var callback = null;

    var  windowFakeObject = {};
    var  documentFakeObject = {
      addEventListener: function(eventName, fn) {
        if (eventName === 'DOMContentLoaded') {
          callback = fn;
        }
      }
    };

    var pageBottom = pageBottomInjector({
      'window': windowFakeObject,
      'document': documentFakeObject
    });

    var spy = jasmine.createSpy('spy').and.callFake(function() {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    });
    pageBottom.then(spy);

    windowFakeObject._satellite.pageBottom();
    callback();
  });

  it('calls executors even after the promise was fulfilled', function(done) {
    var pageBottomInjector = require('inject!../pageBottom');
    var callback = null;

    var  windowFakeObject = {};
    var  documentFakeObject = {
      addEventListener: function(eventName, fn) {
        if (eventName === 'DOMContentLoaded') {
          callback = fn;
        }
      }
    };

    var pageBottom = pageBottomInjector({
      'window': windowFakeObject,
      'document': documentFakeObject
    });

    windowFakeObject._satellite.pageBottom();
    callback();

    pageBottom.then(done);
  });
});
