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
  var injectCreatePublicRequire = require('inject!../createPublicRequire');

  it('should return the static core modules', function() {
    var promiseMock = {};
    var assignMock = {};
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

    var createPublicRequire = injectCreatePublicRequire({
      './public/Promise': promiseMock,
      './public/WeakMap': weakMapMock,
      './public/assign': assignMock,
      './public/clientInfo': clientInfoMock,
      './public/loadScript': loadScriptMock,
      './public/getQueryParam': getQueryParamMock,
      './public/isPlainObject': isPlainObjectMock,
      './public/getDataElementValue': getDataElementMock,
      './public/cookie': cookieMock,
      './public/debounce': debounceMock,
      './public/once': onceMock,
      './public/writeHtml': writeHtmlMock,
      './public/replaceTokens': replaceTokensMock,
      './public/onPageBottom': onPageBottomMock,
      'window': windowMock,
      'document': documentMock
    });

    var publicRequire = createPublicRequire();

    expect(publicRequire('@turbine/promise')).toBe(promiseMock);
    expect(publicRequire('@turbine/weak-map')).toBe(weakMapMock);
    expect(publicRequire('@turbine/assign')).toBe(assignMock);
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
      publicRequire('@turbine/invalidmodulename');
    }).toThrowError(Error);
  });

});
