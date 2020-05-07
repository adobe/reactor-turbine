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

var injectCreateNotifyMonitors = require('inject-loader!../createNotifyMonitors');

describe('function returned by createNotifyMonitors', function () {
  var logger;
  var createNotifyMonitors;

  beforeEach(function () {
    logger = {
      warn: jasmine.createSpy()
    };

    createNotifyMonitors = injectCreateNotifyMonitors({
      './logger': logger
    });
  });

  it("doesn't throw errors if monitors aren't defined", function () {
    var notifyMonitors = createNotifyMonitors({});

    expect(function () {
      notifyMonitors('testtype', {});
    }).not.toThrow();
  });

  it('calls method on monitor if method exists', function () {
    var monitor = {
      ruleTriggered: jasmine.createSpy()
    };

    var notifyMonitors = createNotifyMonitors({
      _monitors: [monitor]
    });

    var event = {};

    notifyMonitors('ruleTriggered', event);

    expect(monitor.ruleTriggered).toHaveBeenCalledWith(event);
    expect(logger.warn).toHaveBeenCalledWith(
      'The _satellite._monitors API may change at ' +
        'any time and should only be used for debugging.'
    );

    // It shouldn't warn again.
    notifyMonitors('ruleTriggered', event);
    expect(logger.warn.calls.count()).toBe(1);
  });

  it("doesn't throw an error if method on monitor doesn't exist", function () {
    var notifyMonitors = createNotifyMonitors({
      _monitors: [{}]
    });

    var event = {};

    expect(function () {
      notifyMonitors('ruleTriggered', event);
    }).not.toThrow();
  });
});
