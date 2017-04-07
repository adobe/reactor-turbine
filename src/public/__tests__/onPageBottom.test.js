/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

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
