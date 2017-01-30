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

describe('extract module exports', function() {
  var extractModuleExports = require('../extractModuleExports');

  it('runs the module code', function() {
    var moduleScript = jasmine.createSpy('module');
    var require = function() {};
    extractModuleExports(moduleScript, require);

    expect(moduleScript).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Object), require);
  });

  it('returns the extracted exports', function() {
    var moduleExports = 'exportedvalue';

    var moduleScript = function(module) {
      module.exports = moduleExports;
    };

    expect(extractModuleExports(moduleScript)).toEqual(moduleExports);
  });
});
