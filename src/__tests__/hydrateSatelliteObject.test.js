'use strict';

var hydrateSatelliteObjectInjector = require('inject!../hydrateSatelliteObject');

describe('hydrateSatelliteObject', function() {
  beforeEach(function() {
    window._satellite = {};
  });

  it('should add a pageBottom function on _satellite', function() {
    var hydrateSatelliteObject = hydrateSatelliteObjectInjector({});
    hydrateSatelliteObject();
    window._satellite.pageBottom();
    expect(window._satellite.pageBottom).toEqual(jasmine.any(Function));
  });

  it('should add a track function on _satellite', function() {
    var hydrateSatelliteObject = hydrateSatelliteObjectInjector({});
    hydrateSatelliteObject();
    window._satellite.track();
    expect(window._satellite.track).toEqual(jasmine.any(Function));
  });

  it('should add a `isLinked` method on _satellite that returns true for an anchor element',
  function() {
    var hydrateSatelliteObject = hydrateSatelliteObjectInjector({});
    hydrateSatelliteObject();
    var l = document.createElement('a');
    expect(_satellite.isLinked(l)).toBe(true);
  });

  it('should add setDebug function on _satellite',
    function() {
      var spy = jasmine.createSpyObj(['notify']);
      var hydrateSatelliteObject = hydrateSatelliteObjectInjector({
        './utils/logger': spy
      });
      hydrateSatelliteObject();
      _satellite.setDebug(true);

      expect(spy.outputEnabled).toBe(true);
    });

  it('successfully allows setting, reading, and removing a cookie', function() {
    var hydrateSatelliteObject = hydrateSatelliteObjectInjector({});
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
    var hydrateSatelliteObject = hydrateSatelliteObjectInjector({});
    hydrateSatelliteObject();

    expect(_satellite.cookie.serialize).toEqual(jasmine.any(Function));
    expect(_satellite.cookie.parse).toEqual(jasmine.any(Function));
  });
});
