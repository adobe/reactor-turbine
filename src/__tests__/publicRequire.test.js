'use strict';

var publicRequireInjector = require('inject!../publicRequire');


describe('publicRequire', function() {
  it('should return the core modules', function() {
    var windowSpy = {};
    var publicRequire = publicRequireInjector({
      'window': windowSpy
    });

    expect(publicRequire('window')).toBe(windowSpy);
  });

  it('should return the property settings modules', function() {
    var propertySettings = {
      domains: [ 'adobe.com', 'example.com' ]
    };

    var mockState = {
      getPropertySettings: function() {
        return propertySettings;
      }
    };

    var publicRequire = publicRequireInjector({
      './state': mockState
    });

    expect(publicRequire('property-settings')).toBe(propertySettings);
  });

  it('should throw error when a non core module is required', function() {
    var publicRequire = publicRequireInjector({});
    expect(function() {
      publicRequire('invalidmodulename');
    }).toThrowError(Error);
  });

  it('is-linked returns true for a link element', function() {
    var l = document.createElement('a');
    var publicRequire = publicRequireInjector({});
    expect(publicRequire('is-linked')(l)).toBe(true);
  });
});
