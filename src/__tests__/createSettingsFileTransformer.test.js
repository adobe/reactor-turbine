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

var createSettingsFileTransformer = require('../createSettingsFileTransformer');

var settingsFileTransformer;
var isDynamicEnforced;
var decorateWithDynamicHostSpy;

beforeEach(function() {
  isDynamicEnforced = true;
  decorateWithDynamicHostSpy = jasmine.createSpy('decorateWithDynamicHost');
  settingsFileTransformer = createSettingsFileTransformer(
    isDynamicEnforced,
    decorateWithDynamicHostSpy
  );
});

// TODO start here, refactor test calls. pull in tests from createModuleProvider
describe('verify pushSettingsValue', function () {
  var decorateWithDynamicHost;
  beforeEach(function () {
    decorateWithDynamicHost = jasmine
      .createSpy('decorateWithDynamicHost')
      .and.returnValue('https://somedomain.com/absoluteUrl');
  });

  describe('basic input/output', function () {
    it('handles undefined', function () {
      expect(
        pushValueIntoSettings(undefined, undefined, decorateWithDynamicHost)
      ).toBe(undefined);
    });

    it('handles null', function () {
      expect(pushValueIntoSettings(null, null, decorateWithDynamicHost)).toBe(
        null
      );
    });
  });

  describe('update tests', function () {
    it('can update a settings object containing one value', function () {
      var oldSettings = {
        source: '/some/relative/url'
      };

      var newSettings = pushValueIntoSettings(
        'source',
        oldSettings,
        decorateWithDynamicHost
      );

      var expectedNewSettings = {
        source: 'https://somedomain.com/absoluteUrl'
      };

      expect(newSettings).toEqual(expectedNewSettings);
    });

    it('can update a top level setting (array)', function () {
      var oldSettings = {
        sources: [
          {
            someUrl: '/some/relative/url',
            someOtherKey: 'foo'
          },
          {
            someOtherKey: 'foo'
          },
          {
            someUrl: '/some/relative/url',
            someOtherKey: 'foo'
          }
        ]
      };

      var newSettings = pushValueIntoSettings(
        'sources[].someUrl',
        oldSettings,
        decorateWithDynamicHost
      );

      var expectedNewSettings = {
        sources: [
          {
            someUrl: 'https://somedomain.com/absoluteUrl',
            someOtherKey: 'foo'
          },
          {
            someOtherKey: 'foo'
          },
          {
            someUrl: 'https://somedomain.com/absoluteUrl',
            someOtherKey: 'foo'
          }
        ]
      };

      expect(newSettings).toEqual(expectedNewSettings);
    });

    it('can update a top level setting (object)', function () {
      var oldSettings = {
        a: {
          b: {
            value: 'foo',
            secondValue: 'world'
          },
          nestedList: ['0', '1', '2']
        },
        someList: ['a', 'b', 'c'],
        topValue: '/some/relative/url'
      };

      var newSettings = pushValueIntoSettings(
        'topValue',
        oldSettings,
        decorateWithDynamicHost
      );

      var expectedNewSettings = {
        a: {
          b: {
            value: 'foo',
            secondValue: 'world'
          },
          nestedList: ['0', '1', '2']
        },
        someList: ['a', 'b', 'c'],
        topValue: 'https://somedomain.com/absoluteUrl'
      };

      expect(newSettings).toEqual(expectedNewSettings);
    });

    it('can update a nested object', function () {
      var oldSettings = {
        a: {
          b: {
            value: 'foo',
            secondValue: 'world',
            someUrl: '/some/relative/url'
          },
          nestedList: [{}, {}, {}]
        },
        someList: [
          {
            someUrl: '/some/relative/url'
          }
        ]
      };

      var newSettings = pushValueIntoSettings(
        'a.b.someUrl',
        oldSettings,
        decorateWithDynamicHost
      );

      var expectedNewSettings = {
        a: {
          b: {
            value: 'foo',
            secondValue: 'world',
            someUrl: 'https://somedomain.com/absoluteUrl'
          },
          nestedList: [{}, {}, {}]
        },
        someList: [
          {
            someUrl: '/some/relative/url'
          }
        ]
      };

      expect(newSettings).toEqual(expectedNewSettings);
    });

    it('can update a nested object', function () {
      var oldSettings = {
        a: {
          b: {
            value: 'foo',
            secondValue: 'world',
            someUrl: '/some/relative/url'
          },
          nestedList: [{}, {}, {}]
        },
        someList: [
          {
            someUrl: '/some/relative/url'
          }
        ]
      };

      var newSettings = pushValueIntoSettings(
        'a.b.someUrl',
        oldSettings,
        decorateWithDynamicHost
      );

      var expectedNewSettings = {
        a: {
          b: {
            value: 'foo',
            secondValue: 'world',
            someUrl: 'https://somedomain.com/absoluteUrl'
          },
          nestedList: [{}, {}, {}]
        },
        someList: [
          {
            someUrl: '/some/relative/url'
          }
        ]
      };

      expect(newSettings).toEqual(expectedNewSettings);
    });

    it('does not unexpectedly transform a setting too early', function () {
      var oldSettings = {
        a: {
          someUrl: {
            value: 'foo',
            secondValue: 'world',
            nestedList: [
              {
                someUrl: '/some/relative/url',
                someOtherKey: 'foo'
              },
              {
                someOtherKey: 'foo'
              },
              {
                someUrl: '/some/relative/url',
                someOtherKey: 'foo'
              }
            ]
          }
        }
      };

      var newSettings = pushValueIntoSettings(
        'a.someUrl.nestedList[].someUrl',
        oldSettings,
        decorateWithDynamicHost
      );

      var expectedNewSettings = {
        a: {
          someUrl: {
            value: 'foo',
            secondValue: 'world',
            nestedList: [
              {
                someUrl: 'https://somedomain.com/absoluteUrl',
                someOtherKey: 'foo'
              },
              {
                someOtherKey: 'foo'
              },
              {
                someUrl: 'https://somedomain.com/absoluteUrl',
                someOtherKey: 'foo'
              }
            ]
          }
        }
      };

      expect(newSettings).toEqual(expectedNewSettings);
    });
  });
});
