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

var createLogActionError = require('../createLogActionError');
var emptyFn = function () {};
var getModuleDisplayNameByRuleComponent = function () {
  return 'value comparison';
};

describe('createLogConditionError returns a function that when called', function () {
  it('logs a message about condition not being met using the logger', function () {
    var loggerSpy = jasmine.createSpyObj('logger', ['error']);
    var e = new Error('some error');
    var getRuleComponentErrorMessage = jasmine
      .createSpy('getRuleComponentErrorMessage')
      .and.returnValue('error message from getRuleComponentErrorMessage');

    createLogActionError(
      getRuleComponentErrorMessage,
      getModuleDisplayNameByRuleComponent,
      loggerSpy,
      emptyFn
    )({ name: 'action1' }, { name: 'rule1' }, e);

    expect(getRuleComponentErrorMessage).toHaveBeenCalledWith(
      'value comparison',
      'rule1',
      e
    );
    expect(loggerSpy.error).toHaveBeenCalledWith(
      'error message from getRuleComponentErrorMessage'
    );
  });

  it('notifies monitors about the rule being completed', function () {
    var notifyMonitorsSpy = jasmine.createSpy('notifyMonitors');

    createLogActionError(
      emptyFn,
      getModuleDisplayNameByRuleComponent,
      { error: emptyFn },
      notifyMonitorsSpy
    )({ name: 'action1' }, { name: 'rule1' });

    expect(notifyMonitorsSpy).toHaveBeenCalledWith('ruleActionFailed', {
      rule: {
        name: 'rule1'
      },
      action: { name: 'action1' }
    });
  });
});
