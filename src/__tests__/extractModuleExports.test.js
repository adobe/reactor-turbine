'use strict';

var extractModuleExports = require('../extractModuleExports');

describe('extract module exports', function() {
  it('runs the module code', function() {
    var moduleDefinition = jasmine.createSpy('module');
    extractModuleExports(moduleDefinition);

    expect(moduleDefinition).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Function));
  });

  it('returns the extracted exports', function() {
    var moduleExports = jasmine.createSpy('module.exports');

    var moduleDefinition = function(module) {
      module.exports = moduleExports;
    };

    expect(extractModuleExports(moduleDefinition)).toEqual(moduleExports);
  });
});
