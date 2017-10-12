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
    var promiseMock = {};
    var objectAssignMock = {};
    var clientInfoMock = {};
    var loadScriptMock = {};
    var getQueryParamMock = {};
    var isPlainObjectMock = {};
    var getDataElementMock = {};
    var cookieMock = {};
    var debounceMock = {};
    var onceMock = {};
    var writeHtmlMock = {};
    var replaceTokensMock = {};
    var onPageBottomMock = {};
    var weakMapMock = {};
    var windowMock = {};
    var documentMock = {};
    var queryStringMock = {};

    var createPublicRequire = injectCreatePublicRequire({
      '@adobe/reactor-promise': promiseMock,
      './public/WeakMap': weakMapMock,
      '@adobe/reactor-object-assign': objectAssignMock,
      './public/clientInfo': clientInfoMock,
      '@adobe/reactor-load-script': loadScriptMock,
      './public/getQueryParam': getQueryParamMock,
      './public/isPlainObject': isPlainObjectMock,
      './public/getDataElementValue': getDataElementMock,
      '@adobe/reactor-cookie': cookieMock,
      './public/debounce': debounceMock,
      './public/once': onceMock,
      './public/writeHtml': writeHtmlMock,
      './public/replaceTokens': replaceTokensMock,
      './public/onPageBottom': onPageBottomMock,
      '@adobe/reactor-window': windowMock,
      '@adobe/reactor-document': documentMock,
      '@adobe/reactor-query-string': queryStringMock
    });

    var publicRequire = createPublicRequire();

    expect(publicRequire('@turbine/promise')).toBe(promiseMock);
    expect(publicRequire('@turbine/weak-map')).toBe(weakMapMock);
    expect(publicRequire('@turbine/assign')).toBe(objectAssignMock);
    expect(publicRequire('@turbine/client-info')).toBe(clientInfoMock);
    expect(publicRequire('@turbine/load-script')).toBe(loadScriptMock);
    expect(publicRequire('@turbine/get-query-param')).toBe(getQueryParamMock);
    expect(publicRequire('@turbine/is-plain-object')).toBe(isPlainObjectMock);
    expect(publicRequire('@turbine/get-data-element-value')).toBe(getDataElementMock);
    expect(publicRequire('@turbine/cookie')).toBe(cookieMock);
    expect(publicRequire('@turbine/debounce')).toBe(debounceMock);
    expect(publicRequire('@turbine/once')).toBe(onceMock);
    expect(publicRequire('@turbine/write-html')).toBe(writeHtmlMock);
    expect(publicRequire('@turbine/replace-tokens')).toBe(replaceTokensMock);
    expect(publicRequire('@turbine/on-page-bottom')).toBe(onPageBottomMock);
    expect(publicRequire('@turbine/window')).toBe(windowMock);
    expect(publicRequire('@turbine/document')).toBe(documentMock);

    expect(publicRequire('@adobe/reactor-cookie')).toBe(cookieMock);
    expect(publicRequire('@adobe/reactor-document')).toBe(documentMock);
    expect(publicRequire('@adobe/reactor-load-script')).toBe(loadScriptMock);
    expect(publicRequire('@adobe/reactor-object-assign')).toBe(objectAssignMock);
    expect(publicRequire('@adobe/reactor-promise')).toBe(promiseMock);
    expect(publicRequire('@adobe/reactor-query-string')).toBe(queryStringMock);
    expect(publicRequire('@adobe/reactor-window')).toBe(windowMock);
  });

  it('should return the dynamic core modules', function() {
    var loggerMock = {};
    var buildInfoMock = {};
    var propertySettingsMock = {};
    var getExtensionSettingsMock = {};
    var getSharedModuleMock = {};
    var getHostedLibFileUrlMock = {};

    var createPublicRequire = injectCreatePublicRequire({});
    var publicRequire = createPublicRequire({
      logger: loggerMock,
      buildInfo: buildInfoMock,
      propertySettings: propertySettingsMock,
      getExtensionSettings: getExtensionSettingsMock,
      getSharedModuleExports: getSharedModuleMock,
      getHostedLibFileUrl: getHostedLibFileUrlMock
    });

    expect(publicRequire('@turbine/logger')).toBe(loggerMock);
    expect(publicRequire('@turbine/build-info')).toBe(buildInfoMock);
    expect(publicRequire('@turbine/property-settings')).toBe(propertySettingsMock);
    expect(publicRequire('@turbine/get-extension-settings'))
      .toBe(getExtensionSettingsMock);
    expect(publicRequire('@turbine/get-shared-module')).toBe(getSharedModuleMock);
    expect(publicRequire('@turbine/get-hosted-lib-file-url')).toBe(getHostedLibFileUrlMock);
  });

  it('should call for relative module when relative path is used', function() {
    var relativeModuleMock = {};

    var createPublicRequire = injectCreatePublicRequire({});

    var getModuleExportsByRelativePath = jasmine.createSpy().and.callFake(function() {
      return relativeModuleMock;
    });

    var publicRequire = createPublicRequire({
      getModuleExportsByRelativePath: getModuleExportsByRelativePath
    });

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

  it('should warn when requiring modules being moved to the turbine free variable', function() {
    var createPublicRequire = injectCreatePublicRequire({});
    var publicRequire = createPublicRequire();
    spyOn(console, 'warn');

    [
      '@turbine/logger',
      '@turbine/build-info',
      '@turbine/property-settings',
      '@turbine/get-extension-settings',
      '@turbine/get-shared-module',
      '@turbine/get-hosted-lib-file-url',
      '@turbine/replace-tokens',
      '@turbine/on-page-bottom',
      '@turbine/get-data-element-value'
    ].forEach(function(name) {
      publicRequire(name);
      expect(console.warn.calls.mostRecent().args[0]).toContain('Please use the new API:');
      console.warn.calls.reset();
    });
  });

  it('should warn when requiring modules being renamed', function() {
    var createPublicRequire = injectCreatePublicRequire({});
    var publicRequire = createPublicRequire();
    spyOn(console, 'warn');

    [
      '@turbine/get-query-param',
      '@turbine/assign',
      '@turbine/promise',
      '@turbine/cookie',
      '@turbine/document',
      '@turbine/load-script',
      '@turbine/window'
    ].forEach(function(name) {
      publicRequire(name);
      expect(console.warn.calls.mostRecent().args[0]).toContain('has been renamed');
    });
  });

  it('should warn when requiring modules being removed', function() {
    var createPublicRequire = injectCreatePublicRequire({});
    var publicRequire = createPublicRequire();
    spyOn(console, 'warn');

    [
      '@turbine/debounce',
      '@turbine/is-plain-object',
      '@turbine/once',
      '@turbine/weak-map',
      '@turbine/write-html',
      '@turbine/client-info'
    ].forEach(function(name) {
      publicRequire(name);
      expect(console.warn.calls.mostRecent().args[0]).toContain('will be removed');
    });
  });
});
