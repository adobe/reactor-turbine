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

var traverseDelegateProperties = require('../traverseDelegateProperties');
// var pluckSettingsValue = traverseDelegateProperties.pluckSettingsValue;
var pushValueIntoSettings = traverseDelegateProperties.pushValueIntoSettings;

// describe('verify pluckSettingsValue', function () {
//   describe('basic input/output', function () {
//     it('handles undefined', function () {
//       expect(pluckSettingsValue(undefined, undefined)).toBe(undefined);
//     });
//
//     it('handles null', function () {
//       expect(pluckSettingsValue(null, null)).toBe(undefined);
//     });
//   });
//
//   describe('handles objects', function () {
//     it('handles unknown nested paths', function () {
//       var pathString = 'a.b.foobar';
//       var settings = {
//         a: {
//           b: {
//             c: 'hello'
//           }
//         }
//       };
//       expect(pluckSettingsValue(pathString, settings)).toBe(undefined);
//     });
//
//     it('handles grabbing an object from the top', function () {
//       var pathString = 'a';
//       var settings = {
//         a: {
//           b: {
//             c: 'hello'
//           }
//         }
//       };
//       expect(pluckSettingsValue(pathString, settings)).toEqual(settings.a);
//     });
//
//     it('handles grabbing an object from the middle', function () {
//       var pathString = 'a.b';
//       var settings = {
//         a: {
//           b: {
//             c: 'hello'
//           }
//         }
//       };
//       expect(pluckSettingsValue(pathString, settings)).toEqual(settings.a.b);
//     });
//
//     it('handles simple object nesting at the end of a chain', function () {
//       var pathString = 'a.b.c';
//       var settings = {
//         a: {
//           b: {
//             c: 'hello'
//           }
//         }
//       };
//       expect(pluckSettingsValue(pathString, settings)).toBe('hello');
//     });
//   });
//
//   describe('handles arrays', function () {
//     it('can handle something at the beginning of an array', function () {
//       var pathString = 'a[0]';
//       var settings = {
//         a: [1, 2, 3, 4, 5]
//       };
//
//       expect(pluckSettingsValue(pathString, settings)).toBe(1);
//     });
//
//     it('can handle something in the middle of an array', function () {
//       var pathString = 'a[2]';
//       var settings = {
//         a: [1, 2, 3, 4, 5]
//       };
//
//       expect(pluckSettingsValue(pathString, settings)).toBe(3);
//     });
//
//     it('can handle something at the end of an array', function () {
//       var pathString = 'a[4]';
//       var settings = {
//         a: [1, 2, 3, 4, 5]
//       };
//
//       expect(pluckSettingsValue(pathString, settings)).toBe(5);
//     });
//
//     it('can handle array out of bounds', function () {
//       var pathString = 'a[100]';
//       var settings = {
//         a: [1, 2, 3]
//       };
//
//       expect(pluckSettingsValue(pathString, settings)).toBe(undefined);
//     });
//
//     it('can handle an array inside of an object', function () {
//       var pathString = 'a.b[2]';
//       var settings = {
//         a: {
//           b: [1, 2, 3, 4, 5]
//         }
//       };
//
//       expect(pluckSettingsValue(pathString, settings)).toBe(3);
//     });
//
//     it('can handle an array inside of an object inside of an array...', function () {
//       var pathString = 'a.b[2].names[1]';
//       var settings = {
//         a: {
//           b: [
//             1,
//             2,
//             {
//               names: ['john', 'jane']
//             },
//             4,
//             5
//           ]
//         }
//       };
//
//       expect(pluckSettingsValue(pathString, settings)).toBe('jane');
//     });
//   });
// });

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

    it('can update a nested array', function () {
      var oldSettings = {
        a: {
          b: {
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
        'a.b.nestedList[].someUrl',
        oldSettings,
        decorateWithDynamicHost
      );

      var expectedNewSettings = {
        a: {
          b: {
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
  });
});
