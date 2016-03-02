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
});
