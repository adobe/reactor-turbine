'use strict';

var state = require('../state');
var helperSpy = jasmine.createSpy('helperSpy');

var container = {
  rules: [
    {
      name: 'Example Rule',
      events: [
        {
          delegateId: 'exampleExtension/events/click',
          settings: {}
        }
      ],
      conditions: [
        {
          delegateId: 'exampleExtension/conditions/operatingSystem',
          settings: {}
        }
      ],
      actions: [
        {
          delegateId: 'exampleExtension/actions/sendBeacon',
          settings: {}
        }
      ]
    }
  ],
  dataElements: {
    myDataElement: {
      delegateId: 'exampleExtension/dataElements/javascriptVariable',
      settings: {}
    }
  },
  extensions: {
    EXa: {
      name: 'exampleExtension',
      displayName: 'Example Extension',
      configurations: {
        ECa: {
          settings: {
            'code': 'somecode'
          }
        }
      },
      delegates: {
        'exampleExtension/events/click': {
          displayName: 'Click', // included because I want to improve logging
          script: function() {}
        },
        'exampleExtension/conditions/operatingSystem': {
          displayName: 'Operating System',
          script: function() {}
        },
        'exampleExtension/actions/sendBeacon': {
          displayName: 'Send Beacon',
          script: function() {}
        },
        'exampleExtension/dataElements/javascriptVariable': {
          displayName: 'JavaScript Variable',
          script: function() {}
        }
      },
      helpers: {
        'exampleExtension/helpers/myExampleHelper': {
          script: jasmine.createSpy().and.callFake(function(module, require) {
            module.exports = helperSpy;
          })
        }
      }
    }
  },
  propertySettings: {},
  appVersion: '52A',
  buildDate: '2015-03-16 20:55:42 UTC',
  publishDate: '2015-03-16 14:43:44 -0600'
};

describe('state ', function() {
  beforeEach(function() {
    state.init(container);
  });

  it('should return extension configurations collection', function() {
    expect(state.getExtension('exampleExtension').getConfigurations()).toEqual({ECa: {
      'code': 'somecode'
    }});
  });

  it('should return extension helper', function() {
    expect(state.getExtension('exampleExtension').getHelper('myExampleHelper'))
      .toBe(helperSpy);
  });

  it('should return null when extension helper is missing', function() {
    expect(state.getExtension('exampleExtension').getHelper('helper'))
      .toBeNull();
  });

  it('should return delegate by id', function() {
    expect(state.getDelegate('exampleExtension/events/click'))
      .toBe(container.extensions.EXa.delegates['exampleExtension/events/click']);
  });

  it('should return rules', function() {
    expect(state.getRules()).toBe(container.rules);
  });


  it('should return data element definition', function() {
    expect(state.getDataElementDefinition('myDataElement'))
      .toBe(container.dataElements.myDataElement);
  });

  it('should return cached data element values', function() {
    state.cacheDataElementValue('somekey', 'pageview', 100);
    expect(state.getCachedDataElementValue('somekey', 'pageview'))
      .toBe(100);
  });

  it('should enable the debug output', function() {
    state.setDebugOuputEnabled('true');
    expect(state.getDebugOutputEnabled()).toBe(true);
  });

  it('getShouldExecuteActions returns false when hide activity local storage key is set',
  function() {
    localStorage.setItem('sdsat_hide_activity', 'true');
    expect(state.getShouldExecuteActions()).toBe(false);
  });

  it('getShouldExecuteActions returns true when hide activity local storage key is not set to true',
    function() {
      localStorage.setItem('sdsat_hide_activity', 'false');
      expect(state.getShouldExecuteActions()).toBe(true);
    });

  it('should allow helpers to load other helpers', function() {
    var exportSpy = jasmine.createSpy('helper2ExportSpy');
    var spy = jasmine.createSpy('helper2Spy');

    state.init({
      extensions: {
        'ext': {
          helpers: {
            'ext/helpers/helper1': {
              script:  function(module, require) {
                var extension = require('get-extension')('ext');
                extension.getHelper('helper2')();
              }
            },
            'ext/helpers/helper2': {
              script:  function(module, require) {
                spy();
                module.exports = exportSpy;
              }
            }
          }
        }
      }
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(exportSpy).toHaveBeenCalled();
  });
});
