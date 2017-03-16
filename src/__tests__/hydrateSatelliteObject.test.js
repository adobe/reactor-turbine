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
