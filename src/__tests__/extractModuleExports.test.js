/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';

describe('extract module exports', function () {
  var extractModuleExports = require('../extractModuleExports');

  it('runs the module code', function () {
    var moduleScript = jasmine.createSpy('module');
    var require = function () {};
    var turbine = {};
    extractModuleExports(moduleScript, require, turbine);

    expect(moduleScript).toHaveBeenCalledWith(
      jasmine.any(Object),
      jasmine.any(Object),
      require,
      turbine
    );
  });

  it('returns the extracted exports', function () {
    var moduleExports = 'exportedvalue';

    var moduleScript = function (module) {
      module.exports = moduleExports;
    };

    expect(extractModuleExports(moduleScript)).toEqual(moduleExports);
  });

  it('returns the extracted exports from a transpiled module using babel', function () {
    var moduleExports = 'exportedvalue';

    var moduleScript = function (module, exports) {
      Object.defineProperty(exports, '__esModule', {
        value: true
      });
      exports.default = void 0;
      var _default = moduleExports;
      exports.default = _default;
    };

    expect(extractModuleExports(moduleScript)).toEqual(moduleExports);
  });
});
