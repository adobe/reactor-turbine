/***************************************************************************************
 * (c) 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

var createDynamicHostResolver = require('../createDynamicHostResolver');
var logger = require('../logger');

var consoleSpy;
var turbineEmbedCode;
var isDynamicEnforced;
var dynamicHostResolver;

describe('createDynamicHostResolver returns a function that when called', function () {
  beforeEach(function () {
    consoleSpy = spyOn(console, 'warn');
  });

  describe('with isDynamicEnforced=false', function () {
    beforeEach(function () {
      isDynamicEnforced = false;
    });

    it('fails silently on creating a URL', function () {
      dynamicHostResolver = createDynamicHostResolver(
        undefined, // turbineEmbedCode
        isDynamicEnforced,
        logger
      );

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('fails silently if there is no turbineEmbedCode', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        isDynamicEnforced,
        logger
      );

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('fails silently unknown protocols', function () {
      turbineEmbedCode = 'file://assets.adobedtm.com:8080/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        isDynamicEnforced,
        logger
      );

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('reflects back what is sent in when turbineEmbedCode is not resolved', function () {
      dynamicHostResolver = createDynamicHostResolver(
        undefined, // turbineEmbedCode
        isDynamicEnforced,
        logger
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my-url')).toBe(
        'my-url'
      );
    });

    it('reflects back what is sent in when turbineEmbedCode is resolved', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        isDynamicEnforced,
        logger
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my-url')).toBe(
        'my-url'
      );
    });
  });

  describe('with isDynamicEnforced=true', function () {
    beforeEach(function () {
      isDynamicEnforced = true;
    });

    it('logs a warning if turbineEmbedCode is not resolved', function () {
      dynamicHostResolver = createDynamicHostResolver(
        undefined, // turbineEmbedCode
        isDynamicEnforced,
        logger
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        jasmine.any(String),
        'Unable to find the Library Embed Code for Dynamic Host Resolution.'
      );
    });

    it('creates the resolver silently with a proper turbineEmbedCode', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        isDynamicEnforced,
        logger
      );

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('handles urls that begin with a leading slash "/my/url"', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        isDynamicEnforced,
        logger
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('/my/url')).toBe(
        'https://assets.adobedtm.com/my/url'
      );
    });

    it('handles urls that do not have a leading slash "my/url"', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        isDynamicEnforced,
        logger
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my/url')).toBe(
        'https://assets.adobedtm.com/my/url'
      );
    });

    it('provides the turbineHost', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com:8080/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        isDynamicEnforced,
        logger
      );

      expect(dynamicHostResolver.getTurbineHost()).toBe(
        'https://assets.adobedtm.com:8080'
      );
    });

    it('upgrades to https all the time', function () {
      turbineEmbedCode = 'http://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        isDynamicEnforced,
        logger
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my/url')).toBe(
        'https://assets.adobedtm.com/my/url'
      );
    });

    it('returns the protocol as a part of URL decoration', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com:8080/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        isDynamicEnforced,
        logger
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my/url')).toBe(
        'https://assets.adobedtm.com:8080/my/url'
      );
    });

    it('returns the protocol as a part of querying the turbine host', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com:8080/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        isDynamicEnforced,
        logger
      );

      expect(dynamicHostResolver.getTurbineHost()).toBe(
        'https://assets.adobedtm.com:8080'
      );
    });

    it('will log an error for unknown protocols', function () {
      turbineEmbedCode = 'file://assets.adobedtm.com:8080/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        isDynamicEnforced,
        logger
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        jasmine.any(String),
        'Unable to find the Library Embed Code for Dynamic Host Resolution.'
      );
    });
  });
});
