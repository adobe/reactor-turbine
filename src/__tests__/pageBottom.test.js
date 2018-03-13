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

var injectPageBottom = require('inject-loader!../pageBottom');

describe('onPageBottom', function() {
  var triggerWindowLoad;
  var windowFakeObject;
  var documentFakeObject;

  beforeEach(function() {
    triggerWindowLoad = null;
    windowFakeObject = {
      addEventListener: function(eventName, fn) {
        if (eventName === 'load') {
          triggerWindowLoad = fn;
        }
      }
    };
    documentFakeObject = {
      readyState: 'loading'
    };
  });

  it('calls the callback when `trigger` is executed', function(done) {
    var pageBottom = injectPageBottom({
      '@adobe/reactor-window': windowFakeObject
    });

    pageBottom.addListener(done);
    pageBottom.trigger();
  });

  it('callback is called only once', function() {
    var pageBottom = injectPageBottom({
      '@adobe/reactor-window': windowFakeObject,
      '@adobe/reactor-document': documentFakeObject
    });
    var spy = jasmine.createSpy();

    pageBottom.addListener(spy);
    pageBottom.trigger();
    pageBottom.trigger();
    triggerWindowLoad();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('calls callback even after pageBottom has been triggered', function(done) {
    var pageBottom = injectPageBottom({
      '@adobe/reactor-window': windowFakeObject,
    });

    pageBottom.trigger();
    pageBottom.addListener(done);
  });

  describe('when trigger is not called', function() {
    it('calls the callback if readyState is complete', function() {
      documentFakeObject.readyState = 'complete';

      var pageBottom = injectPageBottom({
        '@adobe/reactor-document': documentFakeObject
      });
      var spy = jasmine.createSpy();

      pageBottom.addListener(spy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls the callback on window load', function() {
      documentFakeObject.readyState = 'interactive';

      var pageBottom = injectPageBottom({
        '@adobe/reactor-window': windowFakeObject,
        '@adobe/reactor-document': documentFakeObject,
      });
      var spy = jasmine.createSpy();

      pageBottom.addListener(spy);
      triggerWindowLoad();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
