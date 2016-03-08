'use strict';

var resourceProviderInjector = require('inject!../resourceProvider');
var resourceProvider;
var moduleExport = function() {};

describe('resource provider', function() {
  beforeAll(function() {
    resourceProvider = resourceProviderInjector({
      './extractModuleExports': jasmine.createSpy('extractModuleExports').and.callFake(function() {
        return moduleExport;
      })
    });
  });

  it('should return the resource using the provided name', function() {
    var resource = jasmine.createSpy('resource');
    resourceProvider.registerResources({'dtm/resources/somename': resource});

    expect(resourceProvider.getResource('dtm', 'somename')).toBe(resource);
  });

  it('should add module exports to resource', function() {
    var delegate = jasmine.createSpy('delegate');
    resourceProvider.registerResources({'dtm/resources/somename': delegate});

    expect(resourceProvider.getResource('dtm', 'somename').exports).toBe(moduleExport);
  });
});
