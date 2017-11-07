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
  var getInjectedOnPageBottom = function(mocks) {
    return require('inject-loader!../onPageBottom')(mocks);
  };

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

  it('calls the callback when `_satellite.pageBottom` is executed', function(done) {
    var onPageBottom = getInjectedOnPageBottom({
      '@adobe/reactor-window': windowFakeObject
    });

    onPageBottom(done);

    windowFakeObject._satellite.pageBottom();
  });

  it('callback is called only once', function() {
    var onPageBottom = getInjectedOnPageBottom({
      '@adobe/reactor-window': windowFakeObject,
      '@adobe/reactor-document': documentFakeObject
    });
    var spy = jasmine.createSpy();

    onPageBottom(spy);

    windowFakeObject._satellite.pageBottom();
    windowFakeObject._satellite.pageBottom();
    triggerWindowLoad();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('calls callback even after pageBottom has occurred', function(done) {
    var onPageBottom = getInjectedOnPageBottom({
      '@adobe/reactor-window': windowFakeObject,
    });

    windowFakeObject._satellite.pageBottom();

    onPageBottom(done);
  });

  describe('when _satellite.pageBottom() not called', function() {
    it('calls the callback if readyState is complete', function() {
      documentFakeObject.readyState = 'complete';

      var onPageBottom = getInjectedOnPageBottom({
        '@adobe/reactor-document': documentFakeObject
      });
      var spy = jasmine.createSpy();

      onPageBottom(spy);

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('calls the callback on window load', function() {
      documentFakeObject.readyState = 'interactive';

      var onPageBottom = getInjectedOnPageBottom({
        '@adobe/reactor-window': windowFakeObject,
        '@adobe/reactor-document': documentFakeObject,
      });
      var spy = jasmine.createSpy();

      onPageBottom(spy);

      triggerWindowLoad();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
