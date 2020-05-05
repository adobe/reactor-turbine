/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

'use strict';

var createLogRuleCompleted = require('../createLogRuleCompleted');
var emptyFn = function () {};

describe('createLogRuleCompleted returns a function that when called', function () {
  it('logs a complete message using the logger', function () {
    var loggerSpy = jasmine.createSpyObj('logger', ['log']);

    createLogRuleCompleted(loggerSpy, emptyFn)({ name: 'rule1' });

    expect(loggerSpy.log).toHaveBeenCalledWith('Rule "rule1" fired.');
  });

  it('notifies monitors about the rule being completed', function () {
    var notifyMonitorsSpy = jasmine.createSpy('notifyMonitors');

    createLogRuleCompleted(
      { log: emptyFn },
      notifyMonitorsSpy
    )({ name: 'rule1' });

    expect(notifyMonitorsSpy).toHaveBeenCalledWith('ruleCompleted', {
      rule: {
        name: 'rule1'
      }
    });
  });
});
