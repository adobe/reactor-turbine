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

var injectHydrateSatelliteObject = require('inject-loader!../hydrateSatelliteObject');

describe('hydrateSatelliteObject', function () {
  var _satellite;

  var container;

  beforeEach(function () {
    _satellite = {};
    container = {
      company: {
        orgId: 'CB20F0CC53FCF3AC0A4C98A1@AdobeOrg'
      },
      property: {
        name: 'Test Property',
        id: 'property-id',
        settings: {
          foo: 'bar'
        }
      },
      buildInfo: {
        buildDate: '2018-11-08T23:46:28Z',
        turbineBuildDate: '2018-11-07T23:14:07Z',
        turbineVersion: '25.2.2'
      },
      environment: {
        id: 'environment-id',
        stage: 'development'
      }
    };
  });

  it('should add a track function on _satellite', function () {
    var logger = {
      log: jasmine.createSpy(),
      createPrefixedLogger: function () {}
    };
    var hydrateSatelliteObject = injectHydrateSatelliteObject({
      './logger': logger
    });
    hydrateSatelliteObject(_satellite, container);
    expect(_satellite.track).toEqual(jasmine.any(Function));
    // shouldn't throw an error.
    _satellite.track('checkout');
    expect(logger.log).toHaveBeenCalledWith(
      '"checkout" does not match any direct call identifiers.'
    );
  });

  it('should add a getVisitorId function on _satellite', function () {
    var hydrateSatelliteObject = injectHydrateSatelliteObject();
    hydrateSatelliteObject(_satellite, container);
    expect(_satellite.getVisitorId).toEqual(jasmine.any(Function));
    expect(_satellite.getVisitorId()).toBe(null);
  });

  it('should add a property name on _satellite but not settings', function () {
    var hydrateSatelliteObject = injectHydrateSatelliteObject();
    hydrateSatelliteObject(_satellite, container);
    expect(_satellite.property.name).toEqual('Test Property');
    expect(_satellite.property.id).toEqual('property-id');
    expect(_satellite.property.settings).toBeUndefined();
  });

  it('should add company info on _satellite', function () {
    var hydrateSatelliteObject = injectHydrateSatelliteObject();
    hydrateSatelliteObject(_satellite, container);
    expect(_satellite.company.orgId).toEqual(
      'CB20F0CC53FCF3AC0A4C98A1@AdobeOrg'
    );
  });

  it('should add build info on _satellite', function () {
    var logger = {
      deprecation: jasmine.createSpy('deprecation'),
      createPrefixedLogger: function () {}
    };
    // make sure this isn't messed with when it gets passed
    Object.defineProperty(container.buildInfo, 'environment', {
      get: function () {
        logger.deprecation('use container.environment.stage instead.');
        return container.environment.stage;
      }
    });
    var hydrateSatelliteObject = injectHydrateSatelliteObject({
      './logger': logger
    });
    hydrateSatelliteObject(_satellite, container);
    expect(_satellite.buildInfo).toEqual(container.buildInfo);
    expect(_satellite.buildInfo.environment).toBe('development');
    expect(logger.deprecation).toHaveBeenCalledWith(
      'use container.environment.stage instead.'
    );
  });

  it('should add environment info on _satellite', function () {
    var hydrateSatelliteObject = injectHydrateSatelliteObject();
    hydrateSatelliteObject(_satellite, container);
    expect(_satellite.environment).toEqual(container.environment);
  });

  it('should add setDebug function on _satellite', function () {
    var setDebugEnabledSpy = jasmine.createSpy('setDebugEnabled');
    var hydrateSatelliteObject = injectHydrateSatelliteObject();
    hydrateSatelliteObject(_satellite, container, setDebugEnabledSpy);
    _satellite.setDebug(true);

    expect(setDebugEnabledSpy).toHaveBeenCalledWith(true);
  });

  it('successfully allows setting, reading, and removing a cookie', function () {
    var logger = {
      deprecation: jasmine.createSpy(),
      createPrefixedLogger: function () {}
    };
    var hydrateSatelliteObject = injectHydrateSatelliteObject({
      './logger': logger
    });
    hydrateSatelliteObject(_satellite, container);

    var cookieName = 'cookiename';
    var cookieValue = 'cookievalue';

    _satellite.setCookie(cookieName, cookieValue, 91);

    expect(logger.deprecation).toHaveBeenCalledWith(
      '_satellite.setCookie is deprecated. Please use ' +
        '_satellite.cookie.set("cookiename", "cookievalue", { expires: 91 }).'
    );

    expect(
      document.cookie.indexOf(cookieName + '=' + cookieValue)
    ).toBeGreaterThan(-1);

    expect(_satellite.readCookie(cookieName)).toEqual('cookievalue');

    expect(logger.deprecation).toHaveBeenCalledWith(
      '_satellite.readCookie is deprecated. Please use _satellite.cookie.get("cookiename").'
    );

    _satellite.removeCookie(cookieName);

    expect(logger.deprecation).toHaveBeenCalledWith(
      '_satellite.removeCookie is deprecated. Please use _satellite.cookie.remove("cookiename").'
    );

    expect(document.cookie.indexOf(cookieName + '=' + cookieValue)).toBe(-1);
  });

  it('exposes npm cookie package methods', function () {
    var hydrateSatelliteObject = injectHydrateSatelliteObject();
    hydrateSatelliteObject(_satellite, container);

    expect(_satellite.cookie.get).toEqual(jasmine.any(Function));
    expect(_satellite.cookie.set).toEqual(jasmine.any(Function));
    expect(_satellite.cookie.remove).toEqual(jasmine.any(Function));
  });

  it('exposes a logger', function () {
    var hydrateSatelliteObject = injectHydrateSatelliteObject();
    hydrateSatelliteObject(_satellite, container);

    expect(_satellite.logger.log).toEqual(jasmine.any(Function));
    expect(_satellite.logger.info).toEqual(jasmine.any(Function));
    expect(_satellite.logger.warn).toEqual(jasmine.any(Function));
    expect(_satellite.logger.error).toEqual(jasmine.any(Function));
  });

  it('exposes a notify method', function () {
    var loggerMock = jasmine.createSpyObj('logger', [
      'log',
      'info',
      'warn',
      'error',
      'deprecation'
    ]);
    loggerMock.createPrefixedLogger = jasmine
      .createSpy('createPrefixedLogger')
      .and.callFake(function () {
        return loggerMock;
      });
    var hydrateSatelliteObject = injectHydrateSatelliteObject({
      './logger': loggerMock
    });

    hydrateSatelliteObject(_satellite, container);

    _satellite.notify('log test');
    expect(loggerMock.log).toHaveBeenCalledWith('log test');

    _satellite.notify('log test 2', 2);
    expect(loggerMock.log).toHaveBeenCalledWith('log test 2');

    _satellite.notify('info test', 3);
    expect(loggerMock.info).toHaveBeenCalledWith('info test');

    _satellite.notify('warn test', 4);
    expect(loggerMock.warn).toHaveBeenCalledWith('warn test');

    _satellite.notify('error test', 5);
    expect(loggerMock.error).toHaveBeenCalledWith('error test');

    expect(loggerMock.deprecation.calls.count()).toBe(5);
    loggerMock.deprecation.calls.all().forEach(function (call) {
      var logMessage = call.args[0];
      expect(logMessage).toBe(
        '_satellite.notify is deprecated. Please use the `_satellite.logger` API.'
      );
    });
  });

  it(
    'logger.deprecation is called for all deprecated methods on the ' +
      '_satellite object',
    function () {
      var loggerMock = jasmine.createSpyObj('logger', [
        'log',
        'info',
        'warn',
        'error',
        'deprecation'
      ]);
      loggerMock.createPrefixedLogger = jasmine
        .createSpy('createPrefixedLogger')
        .and.callFake(function () {
          return loggerMock;
        });
      var hydrateSatelliteObject = injectHydrateSatelliteObject({
        './logger': loggerMock
      });

      hydrateSatelliteObject(_satellite, container);

      _satellite.setCookie('cookie name', 'cookie value', 1);
      expect(loggerMock.deprecation).toHaveBeenCalledWith(
        '_satellite.setCookie is deprecated. Please use _satellite.cookie.set(' +
          '"cookie name", "cookie value", { expires: 1 }).'
      );

      _satellite.readCookie('cookie name');
      expect(loggerMock.deprecation).toHaveBeenCalledWith(
        '_satellite.readCookie is deprecated. Please use ' +
          '_satellite.cookie.get("cookie name").'
      );

      _satellite.removeCookie('cookie name');
      expect(loggerMock.deprecation).toHaveBeenCalledWith(
        '_satellite.removeCookie is deprecated. Please use ' +
          '_satellite.cookie.remove("cookie name").'
      );
    }
  );

  it('exposes a pageBottom method', function () {
    var hydrateSatelliteObject = injectHydrateSatelliteObject();
    hydrateSatelliteObject(_satellite, container);
    expect(_satellite.pageBottom).toEqual(jasmine.any(Function));
    // shouldn't throw an error.
    _satellite.pageBottom();
  });

  it('exposes the container', function () {
    var logger = {
      warn: jasmine.createSpy(),
      createPrefixedLogger: function () {}
    };
    var hydrateSatelliteObject = injectHydrateSatelliteObject({
      './logger': logger
    });

    hydrateSatelliteObject(_satellite, container);

    spyOn(console, 'warn');
    expect(_satellite._container).toBe(container);
    expect(logger.warn).toHaveBeenCalledWith(
      '_satellite._container may change at any time and ' +
        'should only be used for debugging.'
    );
    // It shouldn't warn again.
    expect(_satellite._container).toBe(container);
    expect(logger.warn.calls.count()).toBe(1);
  });
});
