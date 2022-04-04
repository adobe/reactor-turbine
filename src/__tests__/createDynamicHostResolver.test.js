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

var injectCreateDynamicHostResolver = require('inject-loader!../createDynamicHostResolver');
var createDebugController = require('../createDebugController');

var loggerSpy = jasmine.createSpy('logger');
var consoleSpy;
var turbineEmbedCode;
var dynamicCdnEnabled;
var cdnAllowList;
var dynamicHostResolver;

var createMockWindowProtocol = function (protocol) {
  return {
    location: {
      protocol: protocol + ':'
    }
  };
};
var createDynamicHostResolver;
var mockWindow;

describe('createDynamicHostResolver returns a function that when called', function () {
  var debugController;
  beforeEach(function () {
    delete window.dynamicHostResolver;
    mockWindow = createMockWindowProtocol('https');
    createDynamicHostResolver = injectCreateDynamicHostResolver({
      '@adobe/reactor-window': mockWindow
    });
    consoleSpy = spyOn(console, 'warn');
    debugController = jasmine.createSpyObj('debugController', [
      'onDebugChanged'
    ]);
    dynamicCdnEnabled = true;
  });

  describe('with an undefined cdnAllowList (no decoration should be done)', function () {
    beforeEach(function () {
      cdnAllowList = undefined;
    });

    it('fails silently on creating a URL', function () {
      dynamicHostResolver = createDynamicHostResolver(
        undefined, // turbineEmbedCode
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('fails silently if there is no turbineEmbedCode', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('fails silently unknown protocols', function () {
      turbineEmbedCode = 'file://assets.adobedtm.com:8080/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('reflects back what is sent in when turbineEmbedCode is not resolved', function () {
      dynamicHostResolver = createDynamicHostResolver(
        undefined, // turbineEmbedCode
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my-url')).toBe(
        'my-url'
      );
    });

    it('reflects back what is sent in when turbineEmbedCode is resolved', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my-url')).toBe(
        'my-url'
      );
    });
  });

  describe('with an empty cdnAllowList (no domains allowed)', function () {
    beforeEach(function () {
      cdnAllowList = [];
    });

    it('throws an error when turbineEmbedCode is not defined', function () {
      expect(function () {
        createDynamicHostResolver(
          undefined, // turbineEmbedCode
          dynamicCdnEnabled,
          cdnAllowList,
          debugController
        );
      }).toThrowError(
        'Unable to find the Library Embed Code for Dynamic Host Resolution.'
      );
    });

    it(
      'it throws an error when the list is empty and there is a defined ' +
        'turbineEmbedCode',
      function () {
        expect(function () {
          createDynamicHostResolver(
            '//fake.adobeassets.com',
            dynamicCdnEnabled,
            cdnAllowList,
            debugController
          );
        }).toThrowError(
          'This library is not authorized for this domain. ' +
            'Please contact your CSM for more information.'
        );
      }
    );
  });

  describe('with a defined cdnAllowList', function () {
    beforeEach(function () {
      cdnAllowList = ['assets.adobedtm.com'];
    });

    it('logs a warning if turbineEmbedCode is not resolved', function () {
      expect(function () {
        dynamicHostResolver = createDynamicHostResolver(
          undefined, // turbineEmbedCode
          dynamicCdnEnabled,
          cdnAllowList,
          debugController
        );
      }).toThrowError(
        'Unable to find the Library Embed Code for Dynamic Host Resolution.'
      );
    });

    describe('handles embed codes that begin with //', function () {
      describe('when isDynamicEnforced=true', function () {
        it('and the window protocol is http', function () {
          var mockWindow = createMockWindowProtocol('http');
          createDynamicHostResolver = injectCreateDynamicHostResolver({
            '@adobe/reactor-window': mockWindow
          });
          turbineEmbedCode = '//assets.adobedtm.com/lib/dev.js';
          dynamicHostResolver = createDynamicHostResolver(
            turbineEmbedCode,
            dynamicCdnEnabled,
            cdnAllowList,
            debugController
          );

          expect(consoleSpy).not.toHaveBeenCalled();
          expect(dynamicHostResolver.decorateWithDynamicHost('/my/url')).toBe(
            'http://assets.adobedtm.com/my/url'
          );
        });

        it('and the window protocol is https', function () {
          turbineEmbedCode = '//assets.adobedtm.com/lib/dev.js';
          dynamicHostResolver = createDynamicHostResolver(
            turbineEmbedCode,
            dynamicCdnEnabled,
            cdnAllowList,
            debugController
          );

          expect(consoleSpy).not.toHaveBeenCalled();
          expect(dynamicHostResolver.decorateWithDynamicHost('/my/url')).toBe(
            'https://assets.adobedtm.com/my/url'
          );
        });
      });

      describe('when isDynamicEnforced=false', function () {
        it('and the window protocol is http', function () {
          var mockWindow = createMockWindowProtocol('http');
          createDynamicHostResolver = injectCreateDynamicHostResolver({
            '@adobe/reactor-window': mockWindow
          });
          turbineEmbedCode = '//assets.adobedtm.com/lib/dev.js';

          dynamicHostResolver = createDynamicHostResolver(
            turbineEmbedCode,
            dynamicCdnEnabled,
            undefined, // cdnAllowList,
            debugController
          );

          // simple reflection out of the dynamic resolver
          expect(dynamicHostResolver.decorateWithDynamicHost('/my/url')).toBe(
            '/my/url'
          );
        });

        it('and the window protocol is https', function () {
          turbineEmbedCode = '//assets.adobedtm.com/lib/dev.js';

          dynamicHostResolver = createDynamicHostResolver(
            turbineEmbedCode,
            dynamicCdnEnabled,
            undefined, // cdnAllowList,
            debugController
          );

          // simple reflection out of the dynamic resolver
          expect(dynamicHostResolver.decorateWithDynamicHost('/my/url')).toBe(
            '/my/url'
          );
        });
      });
    });

    it('creates the resolver silently with a proper turbineEmbedCode', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('handles urls that begin with a leading slash "/my/url"', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('/my/url')).toBe(
        'https://assets.adobedtm.com/my/url'
      );
    });

    it('handles urls that do not have a leading slash "my/url"', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my/url')).toBe(
        'https://assets.adobedtm.com/my/url'
      );
    });

    it('provides the turbineHost', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com:8080/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(dynamicHostResolver.getTurbineHost()).toBe(
        'https://assets.adobedtm.com:8080'
      );
    });

    it('leaves explicit https as https', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my/url')).toBe(
        'https://assets.adobedtm.com/my/url'
      );
    });

    it('leaves explicit http as http', function () {
      turbineEmbedCode = 'http://assets.adobedtm.com/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my/url')).toBe(
        'http://assets.adobedtm.com/my/url'
      );
    });

    it('returns the protocol as a part of URL decoration', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com:8080/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my/url')).toBe(
        'https://assets.adobedtm.com:8080/my/url'
      );
    });

    it('returns the protocol as a part of querying the turbine host', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com:8080/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(dynamicHostResolver.getTurbineHost()).toBe(
        'https://assets.adobedtm.com:8080'
      );
    });

    it('removes port 80 from the as a part of url decoration', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com:80/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my/file.js')).toBe(
        'https://assets.adobedtm.com/my/file.js'
      );
    });

    it('removes port 443 from the as a part of url decoration', function () {
      turbineEmbedCode = 'https://assets.adobedtm.com:443/lib/dev.js';
      dynamicHostResolver = createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );

      expect(dynamicHostResolver.decorateWithDynamicHost('my/file.js')).toBe(
        'https://assets.adobedtm.com/my/file.js'
      );
    });

    it('will throw an error for unknown protocols', function () {
      expect(function () {
        turbineEmbedCode = 'file://assets.adobedtm.com:8080/lib/dev.js';
        dynamicHostResolver = createDynamicHostResolver(
          turbineEmbedCode,
          dynamicCdnEnabled,
          cdnAllowList,
          debugController
        );
      }).toThrowError(
        'Unable to find the Library Embed Code for Dynamic Host Resolution.'
      );
    });

    it(
      'it throws an error if the turbineEmbedCode does not fall within ' +
        'the allow list',
      function () {
        cdnAllowList = ['first.domain.com', 'second.domain.com'];

        expect(function () {
          createDynamicHostResolver(
            'https://foo-bar-domain.com:443',
            dynamicCdnEnabled,
            cdnAllowList,
            debugController
          );
        }).toThrowError(
          'This library is not authorized for this domain. ' +
            'Please contact your CSM for more information.'
        );
      }
    );

    describe('does not decorate a "url" that is not a string', function () {
      var dynamicHostResolver;
      beforeEach(function () {
        turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
        dynamicHostResolver = createDynamicHostResolver(
          turbineEmbedCode,
          dynamicCdnEnabled,
          cdnAllowList,
          debugController
        );
      });

      it('number case', function () {
        expect(dynamicHostResolver.decorateWithDynamicHost(5)).toBe(5);
      });

      it('object case', function () {
        var myObject = { hello: 'world' };
        expect(dynamicHostResolver.decorateWithDynamicHost(myObject)).toBe(
          myObject
        );
      });

      it('array case', function () {
        var myList = ['my', 'list'];
        expect(dynamicHostResolver.decorateWithDynamicHost(myList)).toBe(
          myList
        );
      });

      it('null case', function () {
        expect(dynamicHostResolver.decorateWithDynamicHost(null)).toBe(null);
      });

      it('undefined case', function () {
        expect(dynamicHostResolver.decorateWithDynamicHost(undefined)).toBe(
          undefined
        );
      });
    });

    it('adds the dynamicHostResolver to the window when debug is enabled', function () {
      expect(window.dynamicHostResolver).toBe(undefined);

      var localStorage = {
        setItem: jasmine.createSpy(),
        getItem: jasmine.createSpy().and.returnValue('false') // output disabled
      };
      debugController = createDebugController(localStorage, loggerSpy);
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );
      debugController.setDebugEnabled(true); // enable output

      expect(mockWindow.dynamicHostResolver).not.toBe(undefined);
    });

    it('does not add the dynamicHostResolver to the window when debug is disabled', function () {
      expect(window.dynamicHostResolver).toBe(undefined);

      var localStorage = {
        setItem: jasmine.createSpy(),
        getItem: jasmine.createSpy().and.returnValue('true') // output enabled
      };
      debugController = createDebugController(localStorage, loggerSpy);
      turbineEmbedCode = 'https://assets.adobedtm.com/lib/dev.js';
      createDynamicHostResolver(
        turbineEmbedCode,
        dynamicCdnEnabled,
        cdnAllowList,
        debugController
      );
      debugController.setDebugEnabled(false); // disable output

      expect(mockWindow.dynamicHostResolver).toBe(undefined);
    });
  });
});
