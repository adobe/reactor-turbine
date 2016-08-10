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
    var getVarMock = {};
    var getDataElementMock = {};
    var cookieMock = {};
    var debounceMock = {};
    var onceMock = {};
    var loggerMock = {};
    var writeHtmlMock = {};
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
      './public/getVar': getVarMock,
      './public/getDataElementValue': getDataElementMock,
      './public/cookie': cookieMock,
      './public/debounce': debounceMock,
      './public/once': onceMock,
      './public/logger': loggerMock,
      './public/writeHtml': writeHtmlMock,
      './public/onPageBottom': onPageBottomMock,
      'window': windowMock,
      'document': documentMock
    });

    var publicRequire = createPublicRequire();

    expect(publicRequire('event-emitter')).toBe(eventEmitterMock);
    expect(publicRequire('promise')).toBe(promiseMock);
    expect(publicRequire('weak-map')).toBe(weakMapMock);
    expect(publicRequire('assign')).toBe(assignMock);
    expect(publicRequire('client-info')).toBe(clientInfoMock);
    expect(publicRequire('load-script')).toBe(loadScriptMock);
    expect(publicRequire('get-query-param')).toBe(getQueryParamMock);
    expect(publicRequire('is-plain-object')).toBe(isPlainObjectMock);
    expect(publicRequire('is-linked')).toEqual(jasmine.any(Function));
    expect(publicRequire('get-var')).toBe(getVarMock);
    expect(publicRequire('get-data-element')).toBe(getDataElementMock);
    expect(publicRequire('cookie')).toBe(cookieMock);
    expect(publicRequire('debounce')).toBe(debounceMock);
    expect(publicRequire('once')).toBe(onceMock);
    expect(publicRequire('logger')).toBe(loggerMock);
    expect(publicRequire('write-html')).toBe(writeHtmlMock);
    expect(publicRequire('on-page-bottom')).toBe(onPageBottomMock);
    expect(publicRequire('window')).toBe(windowMock);
    expect(publicRequire('document')).toBe(documentMock);
  });

  it('should return the dynamic core modules', function() {
    var buildInfoMock = {};
    var propertySettingsMock = {};
    var getExtensionConfigurationsMock = {};
    var getSharedModuleMock = {};
    var getHostedLibFileUrlMock = {};

    var createPublicRequire = injectCreatePublicRequire({});
    var publicRequire = createPublicRequire(
      buildInfoMock,
      propertySettingsMock,
      getExtensionConfigurationsMock,
      getSharedModuleMock,
      null,
      getHostedLibFileUrlMock
    );

    expect(publicRequire('build-info')).toBe(buildInfoMock);
    expect(publicRequire('property-settings')).toBe(propertySettingsMock);
    expect(publicRequire('get-extension-configurations')).toBe(getExtensionConfigurationsMock);
    expect(publicRequire('get-shared-module')).toBe(getSharedModuleMock);
    expect(publicRequire('get-hosted-lib-file-url')).toBe(getHostedLibFileUrlMock);
  });

  it('should call for relative module when relative path is used', function() {
    var relativeModuleMock = {};

    var createPublicRequire = injectCreatePublicRequire({});

    var getModuleExportsByRelativePath = jasmine.createSpy().and.callFake(function() {
      return relativeModuleMock;
    });

    var publicRequire = createPublicRequire(
      null,
      null,
      null,
      null,
      getModuleExportsByRelativePath
    );

    expect(publicRequire('./foo/bar.js')).toBe(relativeModuleMock);
    expect(getModuleExportsByRelativePath).toHaveBeenCalledWith('./foo/bar.js');

    expect(publicRequire('../../foo/bar.js')).toBe(relativeModuleMock);
    expect(getModuleExportsByRelativePath).toHaveBeenCalledWith('../../foo/bar.js');
  });

  it('should throw error when a module that is neither core nor relative is required', function() {
    var createPublicRequire = injectCreatePublicRequire({});
    var publicRequire = createPublicRequire();
    expect(function() {
      publicRequire('invalidmodulename');
    }).toThrowError(Error);
  });

  it('is-linked returns true for a link element', function() {
    var link = document.createElement('a');
    var createPublicRequire = injectCreatePublicRequire({});
    var publicRequire = createPublicRequire();
    expect(publicRequire('is-linked')(link)).toBe(true);
  });
});
