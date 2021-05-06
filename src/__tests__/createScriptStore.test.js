/***************************************************************************************
 * Copyright 2019 Adobe. All rights reserved.
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

var createScriptStoreInjector = require('inject-loader!../createScriptStore');
var createDynamicHostResolver = require('../createDynamicHostResolver');
var logger = require('../logger');
var Promise = require('@adobe/reactor-promise');

describe('get source by url', function () {
  var loadScriptSpy;
  var scriptStore;
  var dynamicHostResolver;

  beforeEach(function () {
    loadScriptSpy = jasmine.createSpy('load-script').and.callFake(function () {
      console.log('resolving load script');
      return Promise.resolve();
    });

    dynamicHostResolver = createDynamicHostResolver(undefined, false, logger);
    var createScriptStore = createScriptStoreInjector({
      '@adobe/reactor-load-script': loadScriptSpy
    });

    scriptStore = createScriptStore(
      dynamicHostResolver.decorateWithDynamicHost
    );
  });

  it('loads the script containing the script only once', function () {
    scriptStore.retrieveScript('url1');
    scriptStore.retrieveScript('url1');

    expect(loadScriptSpy).toHaveBeenCalledTimes(1);
  });

  it('returns a promise that once fulfilled returns the code', function (done) {
    scriptStore.registerScript('url1', 'script code');
    scriptStore.retrieveScript('url1').then(function (code) {
      expect(code).toBe('script code');
      done();
    });
  });

  it('returns undefined when the script cannot be loaded', function (done) {
    var loadScriptSpy = jasmine
      .createSpy('load-script')
      .and.callFake(function () {
        return Promise.reject();
      });

    var createScriptStore = createScriptStoreInjector({
      '@adobe/reactor-load-script': loadScriptSpy
    });

    scriptStore = createScriptStore(
      dynamicHostResolver.decorateWithDynamicHost
    );

    scriptStore.retrieveScript('url1').then(function (code) {
      expect(code).toBeUndefined();
      done();
    });
  });
});
