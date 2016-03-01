'use strict';

var publicRequireInjector = require('inject!../publicRequire');

describe('publicRequire', function() {
  it('should return the core modules', function() {
    var windowSpy = jasmine.createSpy('window');
    var publicRequire = publicRequireInjector({
      'window': windowSpy
    });

    expect(publicRequire('window')).toBe(windowSpy);
  });

  it('should return the property settings modules', function() {
    var propertySettings = {
      domains: [ 'adobe.com', 'example.com' ]
    };

    var stateSpy = jasmine.createSpyObj(['getPropertySettings']);
    stateSpy.getPropertySettings.and.returnValue(propertySettings);

    var publicRequire = publicRequireInjector({
      './state': stateSpy
    });

    expect(publicRequire('property-settings')).toEqual({
      domains: [ 'adobe.com', 'example.com' ]
    });
  });

  it('should throw error when a non core module is required', function() {
    var publicRequire = publicRequireInjector({});
    expect(function() {
      publicRequire('invalidmodulename');
    }).toThrowError(Error);
  });
});
