'use strict';

var delegateProviderInjector = require('inject!../delegateProvider');
var delegateProvider;
var moduleExport = function() {};

describe('delegate provider', function() {
  beforeAll(function() {
    delegateProvider = delegateProviderInjector({
      './extractModuleExports': jasmine.createSpy('extractModuleExports').and.callFake(function() {
        return moduleExport;
      })
    });
  });
  it('should return a delegate by the delegate id', function() {
    var delegate = jasmine.createSpy('delegate');
    delegateProvider.addDelegate('someid', delegate);

    expect(delegateProvider.getDelegate('someid')).toBe(delegate);
  });

  it('should add module exports to delegate', function() {
    var delegate = jasmine.createSpy('delegate');
    delegateProvider.addDelegate('someid', delegate);

    expect(delegateProvider.getDelegate('someid').exports).toBe(moduleExport);
  });
});
