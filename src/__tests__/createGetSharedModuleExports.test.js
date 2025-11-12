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

describe('function returned by createGetSharedModuleExports', function () {
  var {
    injectCreateGetSharedModuleExports
  } = require('../createGetSharedModuleExports');
  var getSharedModuleExports;
  var loggerMock;

  beforeEach(function () {
    var extensions = {
      'hello-world': {
        modules: {
          'hello-world/src/foo.js': {
            name: 'foo',
            shared: true
          },
          'hello-world/src/baz.js': {}
        }
      }
    };

    var moduleProvider = {
      getModuleExports: function (referencePath) {
        return 'exports from ' + referencePath;
      }
    };

    loggerMock = jasmine.createSpyObj('logger', [
      'log',
      'info',
      'debug',
      'warn',
      'error'
    ]);
    var createGetSharedModuleExports = injectCreateGetSharedModuleExports({
      logger: loggerMock
    });
    getSharedModuleExports = createGetSharedModuleExports(
      extensions,
      moduleProvider
    );
  });

  it("returns a shared module's exports", function () {
    var exports = getSharedModuleExports('hello-world', 'foo');
    expect(exports).toBe('exports from hello-world/src/foo.js');
    expect(loggerMock.log).not.toHaveBeenCalled();
    expect(loggerMock.info).not.toHaveBeenCalled();
    expect(loggerMock.debug).not.toHaveBeenCalled();
    expect(loggerMock.warn).not.toHaveBeenCalled();
    expect(loggerMock.error).not.toHaveBeenCalled();
  });

  it('returns undefined if no matching extension is found', function () {
    var exports = getSharedModuleExports('unknown-extension', 'some-module');
    expect(exports).toBeUndefined();
    expect(loggerMock.error).toHaveBeenCalledWith(
      'The extension "unknown-extension" is not bundled with the library."'
    );
  });

  it('returns undefined if no matching shared module is found', function () {
    var exports = getSharedModuleExports('hello-world', 'baz');
    expect(exports).toBeUndefined();
    expect(loggerMock.error).toHaveBeenCalledWith(
      'The module "baz" does not exist in the shared modules of the "hello-world" extension'
    );
  });
});
