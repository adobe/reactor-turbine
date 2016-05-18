'use strict';

describe('extract module exports', function() {
  var extractModuleExports = require('../extractModuleExports');

  it('runs the module code', function() {
    var moduleScript = jasmine.createSpy('module');
    var require = function() {};
    extractModuleExports(moduleScript, require);

    expect(moduleScript).toHaveBeenCalledWith(jasmine.any(Object), require);
  });

  it('returns the extracted exports', function() {
    var moduleExports = 'exportedvalue';

    var moduleScript = function(module) {
      module.exports = moduleExports;
    };

    expect(extractModuleExports(moduleScript)).toEqual(moduleExports);
  });
});
