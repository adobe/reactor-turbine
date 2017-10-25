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

describe('function returned by createPublicRequire', function() {
  var injectCreatePublicRequire = require('inject-loader!../createPublicRequire');

  it('should return the static core modules', function() {
    var cookieMock = {};
    var documentMock = {};
    var loadScriptMock = {};
    var objectAssignMock = {};
    var promiseMock = {};
    var queryStringMock = {};
    var windowMock = {};

    var createPublicRequire = injectCreatePublicRequire({
      '@adobe/reactor-cookie': cookieMock,
      '@adobe/reactor-document': documentMock,
      '@adobe/reactor-load-script': loadScriptMock,
      '@adobe/reactor-object-assign': objectAssignMock,
      '@adobe/reactor-promise': promiseMock,
      '@adobe/reactor-query-string': queryStringMock,
      '@adobe/reactor-window': windowMock
    });

    var publicRequire = createPublicRequire();

    expect(publicRequire('@adobe/reactor-cookie')).toBe(cookieMock);
    expect(publicRequire('@adobe/reactor-document')).toBe(documentMock);
    expect(publicRequire('@adobe/reactor-load-script')).toBe(loadScriptMock);
    expect(publicRequire('@adobe/reactor-object-assign')).toBe(objectAssignMock);
    expect(publicRequire('@adobe/reactor-promise')).toBe(promiseMock);
    expect(publicRequire('@adobe/reactor-query-string')).toBe(queryStringMock);
    expect(publicRequire('@adobe/reactor-window')).toBe(windowMock);
  });

  it('should call for relative module when relative path is used', function() {
    var relativeModuleMock = {};

    var createPublicRequire = injectCreatePublicRequire({});

    var getModuleExportsByRelativePath = jasmine.createSpy().and.callFake(function() {
      return relativeModuleMock;
    });

    var publicRequire = createPublicRequire(getModuleExportsByRelativePath);

    expect(publicRequire('./foo/bar.js')).toBe(relativeModuleMock);
    expect(getModuleExportsByRelativePath).toHaveBeenCalledWith('./foo/bar.js');

    expect(publicRequire('../../foo/bar.js')).toBe(relativeModuleMock);
    expect(getModuleExportsByRelativePath).toHaveBeenCalledWith('../../foo/bar.js');
  });

  it('should throw error when a module that is neither core nor relative is required', function() {
    var createPublicRequire = injectCreatePublicRequire({});
    var publicRequire = createPublicRequire();
    expect(function() {
      publicRequire('@adobe/reactor-invalidmodulename');
    }).toThrowError(Error);
  });
});
