'use strict';

describe('function returned by createPublicRequire', function() {
  var injectCreatePublicRequire = require('inject!../createPublicRequire');

  it('should return the static core modules', function() {
    var promiseMock = {};
    var eventEmitterMock = {};
    var assignMock = {};
    var clientInfoMock = {};
    var loadScriptMock = {};
    var getQueryParamMock = {};
    var isPlainObjectMock = {};
    var getDataElementMock = {};
    var cookieMock = {};
    var debounceMock = {};
    var onceMock = {};
    var loggerMock = {};
    var writeHtmlMock = {};
    var replaceTokensMock = {};
    var onPageBottomMock = {};
    var weakMapMock = {};
    var windowMock = {};
    var documentMock = {};

    var createPublicRequire = injectCreatePublicRequire({
      './public/EventEmitter': eventEmitterMock,
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
      './public/logger': loggerMock,
      './public/writeHtml': writeHtmlMock,
      './public/replaceTokens': replaceTokensMock,
      './public/onPageBottom': onPageBottomMock,
      'window': windowMock,
      'document': documentMock
    });

    var publicRequire = createPublicRequire();

    expect(publicRequire('@turbine/event-emitter')).toBe(eventEmitterMock);
    expect(publicRequire('@turbine/promise')).toBe(promiseMock);
    expect(publicRequire('@turbine/weak-map')).toBe(weakMapMock);
    expect(publicRequire('@turbine/assign')).toBe(assignMock);
    expect(publicRequire('@turbine/client-info')).toBe(clientInfoMock);
    expect(publicRequire('@turbine/load-script')).toBe(loadScriptMock);
    expect(publicRequire('@turbine/get-query-param')).toBe(getQueryParamMock);
    expect(publicRequire('@turbine/is-plain-object')).toBe(isPlainObjectMock);
    expect(publicRequire('@turbine/is-linked')).toEqual(jasmine.any(Function));
    expect(publicRequire('@turbine/get-data-element-value')).toBe(getDataElementMock);
    expect(publicRequire('@turbine/cookie')).toBe(cookieMock);
    expect(publicRequire('@turbine/debounce')).toBe(debounceMock);
    expect(publicRequire('@turbine/once')).toBe(onceMock);
    expect(publicRequire('@turbine/logger')).toBe(loggerMock);
    expect(publicRequire('@turbine/write-html')).toBe(writeHtmlMock);
    expect(publicRequire('@turbine/replace-tokens')).toBe(replaceTokensMock);
    expect(publicRequire('@turbine/on-page-bottom')).toBe(onPageBottomMock);
    expect(publicRequire('@turbine/window')).toBe(windowMock);
    expect(publicRequire('@turbine/document')).toBe(documentMock);
  });

  it('should return the dynamic core modules', function() {
    var buildInfoMock = {};
    var propertySettingsMock = {};
    var getExtensionConfigurationsMock = {};
    var getSharedModuleMock = {};
    var getHostedLibFileUrlMock = {};

    var createPublicRequire = injectCreatePublicRequire({});
    var publicRequire = createPublicRequire({
      buildInfo: buildInfoMock,
      propertySettings: propertySettingsMock,
      getExtensionConfigurations: getExtensionConfigurationsMock,
      getSharedModuleExports: getSharedModuleMock,
      getHostedLibFileUrl: getHostedLibFileUrlMock
    });

    expect(publicRequire('@turbine/build-info')).toBe(buildInfoMock);
    expect(publicRequire('@turbine/property-settings')).toBe(propertySettingsMock);
    expect(publicRequire('@turbine/get-extension-configurations'))
      .toBe(getExtensionConfigurationsMock);
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

  it('is-linked returns true for a link element', function() {
    var link = document.createElement('a');
    var createPublicRequire = injectCreatePublicRequire({});
    var publicRequire = createPublicRequire();
    expect(publicRequire('@turbine/is-linked')(link)).toBe(true);
  });

  it('should log warning when requiring core module without @turbine scope', function() {
    spyOn(console, 'warn');

    var eventEmitterMock = {};
    var createPublicRequire = injectCreatePublicRequire({
      './public/EventEmitter': eventEmitterMock
    });

    var publicRequire = createPublicRequire();
    expect(publicRequire('event-emitter')).toBe(eventEmitterMock);
    expect(console.warn).toHaveBeenCalled();
  });
});
