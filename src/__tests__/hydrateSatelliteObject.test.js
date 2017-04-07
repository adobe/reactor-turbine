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

'use strict';

var noop = function() {};

describe('hydrateSatelliteObject', function() {
  var injectHydrateSatelliteObject = require('inject!../hydrateSatelliteObject');

  beforeEach(function() {
    window._satellite = {};
  });

  it('should add a track function on _satellite', function() {
    var hydrateSatelliteObject = injectHydrateSatelliteObject({});
    hydrateSatelliteObject();
    expect(window._satellite.track).toEqual(jasmine.any(Function));
    // shouldn't throw an error.
    window._satellite.track();
  });

  it('should add a getVisitorId function on _satellite', function() {
    var hydrateSatelliteObject = injectHydrateSatelliteObject({});
    hydrateSatelliteObject();
    expect(window._satellite.getVisitorId).toEqual(jasmine.any(Function));
    expect(window._satellite.getVisitorId()).toBe(null);
  });

  it('should add setDebug function on _satellite',
    function() {
      var loggerMock = {
        outputEnabled: false,
        createPrefixedLogger: function() {}
      };
      var setDebugOutputEnabledSpy = jasmine.createSpy('setDebugOutputEnabled');
      var hydrateSatelliteObject = injectHydrateSatelliteObject({
        './logger': loggerMock
      });
      hydrateSatelliteObject(null, setDebugOutputEnabledSpy);
      _satellite.setDebug(true);

      expect(setDebugOutputEnabledSpy).toHaveBeenCalledWith(true);
      expect(loggerMock.outputEnabled).toBe(true);
    });

  it('successfully allows setting, reading, and removing a cookie', function() {
    var hydrateSatelliteObject = injectHydrateSatelliteObject({});
    hydrateSatelliteObject();

    var cookieName = 'cookiename';
    var cookieValue = 'cookievalue';

    _satellite.setCookie(cookieName, cookieValue, 91);

    expect(document.cookie.indexOf(cookieName + '=' + cookieValue)).toBeGreaterThan(-1);

    expect(_satellite.getCookie(cookieName)).toEqual('cookievalue');

    _satellite.removeCookie(cookieName);

    expect(document.cookie.indexOf(cookieName + '=' + cookieValue)).toBe(-1);
  });

  it('exposes npm cookie package methods', function() {
    var hydrateSatelliteObject = injectHydrateSatelliteObject({});
    hydrateSatelliteObject();

    expect(_satellite.cookie.serialize).toEqual(jasmine.any(Function));
    expect(_satellite.cookie.parse).toEqual(jasmine.any(Function));
  });

  it('exposes a logger', function() {
    var hydrateSatelliteObject = injectHydrateSatelliteObject({});
    hydrateSatelliteObject();

    expect(_satellite.logger.log).toEqual(jasmine.any(Function));
    expect(_satellite.logger.info).toEqual(jasmine.any(Function));
    expect(_satellite.logger.warn).toEqual(jasmine.any(Function));
    expect(_satellite.logger.error).toEqual(jasmine.any(Function));
  });

  it('exposes a notify method', function() {
    var loggerMock = jasmine.createSpyObj('logger', [
      'log',
      'info',
      'warn',
      'error'
    ]);

    var hydrateSatelliteObject = injectHydrateSatelliteObject({
      './logger': {
        warn: noop,
        log: noop,
        info: noop,
        error: noop,
        createPrefixedLogger: function() {
          return loggerMock;
        }
      }
    });
    hydrateSatelliteObject();

    _satellite.notify('log test');
    expect(loggerMock.log).toHaveBeenCalledWith('log test');

    _satellite.notify('log test 2', 2);
    expect(loggerMock.log).toHaveBeenCalledWith('log test 2');

    _satellite.notify('info test', 3);
    expect(loggerMock.info).toHaveBeenCalledWith('info test');

    _satellite.notify('warn test', 4);
    expect(loggerMock.warn).toHaveBeenCalledWith('warn test');

    _satellite.notify('error test', 5);
    expect(loggerMock.error).toHaveBeenCalledWith('error test');
  });
});
