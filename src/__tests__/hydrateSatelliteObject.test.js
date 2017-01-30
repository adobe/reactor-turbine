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

  it('should add a `isLinked` method on _satellite that returns true for an anchor element',
  function() {
    var hydrateSatelliteObject = injectHydrateSatelliteObject({});
    hydrateSatelliteObject();
    var l = document.createElement('a');
    expect(_satellite.isLinked(l)).toBe(true);
  });

  it('should add setDebug function on _satellite',
    function() {
      var notifySpy = jasmine.createSpyObj(['notify']);
      var setDebugOutputEnabledSpy = jasmine.createSpy('setDebugOutputEnabled');
      var hydrateSatelliteObject = injectHydrateSatelliteObject({
        './public/logger': notifySpy
      });
      hydrateSatelliteObject(null, setDebugOutputEnabledSpy);
      _satellite.setDebug(true);

      expect(setDebugOutputEnabledSpy).toHaveBeenCalledWith(true);
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
});
