/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

describe('onPageBottom', function() {
  var getInjectedOnPageBottom = function(options) {
    return require('inject!../onPageBottom')({
      'window': options.window,
      'document': options.document,
      '../logger': options.logger || require('../../logger'),
      './once': require('../once')
    });
  };

  it('calls the callback when `_satellite.pageBottom` is executed', function(done) {
    var windowFakeObject = {};
    var documentFakeObject = { addEventListener: function() {} };

    var onPageBottom = getInjectedOnPageBottom({
      window: windowFakeObject,
      document: documentFakeObject
    });

    onPageBottom(done);

    windowFakeObject._satellite.pageBottom();
  });

  it('calls the callback when DOMContentLoaded is executed', function() {
    var triggerDOMContentLoaded = null;

    var windowFakeObject = {};
    var documentFakeObject = {
      addEventListener: function(eventName, fn) {
        if (eventName === 'DOMContentLoaded') {
          triggerDOMContentLoaded = fn;
        }
      }
    };
    var loggerFakeObject = {
      error: jasmine.createSpy()
    };

    var onPageBottom = getInjectedOnPageBottom({
      window: windowFakeObject,
      document: documentFakeObject,
      logger: loggerFakeObject
    });

    var spy = jasmine.createSpy();

    onPageBottom(spy);

    triggerDOMContentLoaded();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(loggerFakeObject.error).toHaveBeenCalledWith('_satellite.pageBottom() was not called ' +
      'before the document finished loading. Please call _satellite.pageBottom() at the end of ' +
      'the body tag to ensure proper behavior.');
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

    var onPageBottom = getInjectedOnPageBottom({
      window: windowFakeObject,
      document: documentFakeObject
    });

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

    var onPageBottom = getInjectedOnPageBottom({
      window: windowFakeObject,
      document: documentFakeObject
    });

    windowFakeObject._satellite.pageBottom();

    onPageBottom(done);
  });
});
