'use strict';

var helperProviderInjector = require('inject!../helperProvider');
var helperProvider;
var moduleExport = function() {};

describe('helper provider', function() {
  beforeAll(function() {
    helperProvider = helperProviderInjector({
      './extractModuleExports': jasmine.createSpy('extractModuleExports').and.callFake(function() {
        return moduleExport;
      })
    });
  });

  it('should return the helper using the provided name', function() {
    var helper = jasmine.createSpy('helper');
    helperProvider.registerHelpers({'dtm/helpers/somename': helper});

    expect(helperProvider.getHelper('dtm', 'somename')).toBe(helper);
  });

  it('should add module exports to helper', function() {
    var delegate = jasmine.createSpy('delegate');
    helperProvider.registerHelpers({'dtm/helpers/somename': delegate});

    expect(helperProvider.getHelper('dtm', 'somename').exports).toBe(moduleExport);
  });
});
