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

var createRunActions = require('../createRunActions');
var emptyFn = function () {};

describe('createRunActions returns a function that when called', function () {
  it('calls executeDelegateModule for each action module', function () {
    var executeDelegateModuleSpy = jasmine.createSpy('executeDelegateModule');
    var syntheticEvent = { $type: 'some type' };
    var actions = [
      { modulePath: 'path1', settings: {} },
      { modulePath: 'path2', settings: {} }
    ];

    var rule = { actions: actions };

    var logActionError = emptyFn;
    var logRuleCompleted = emptyFn;

    createRunActions(
      executeDelegateModuleSpy,
      logActionError,
      logRuleCompleted
    )(rule, syntheticEvent);

    expect(executeDelegateModuleSpy).toHaveBeenCalledWith(
      actions[0],
      'actions',
      syntheticEvent,
      [syntheticEvent]
    );

    expect(executeDelegateModuleSpy).toHaveBeenCalledWith(
      actions[1],
      'actions',
      syntheticEvent,
      [syntheticEvent]
    );
  });

  it('logs message when rule is completed', function () {
    var logRuleCompletedSpy = jasmine.createSpy('logRuleCompleted');

    var executeDelegateModule = emptyFn;
    var logActionError = emptyFn;

    var rule = { actions: [] };
    var syntheticEvent = {};

    createRunActions(
      executeDelegateModule,
      logActionError,
      logRuleCompletedSpy
    )(rule, syntheticEvent);

    expect(logRuleCompletedSpy).toHaveBeenCalledWith({ actions: [] });
  });

  it('logs message when rule action throws an error', function () {
    var logActionErrorSpy = jasmine.createSpy('logActionError');
    var e = new Error('some error');
    var actions = [{ modulePath: 'path1', settings: {} }];
    var rule = { actions: actions };
    var syntheticEvent = {};

    var executeDelegateModule = function () {
      throw e;
    };
    var logRuleCompleted = emptyFn;

    createRunActions(
      executeDelegateModule,
      logActionErrorSpy,
      logRuleCompleted
    )(rule, syntheticEvent);

    expect(logActionErrorSpy).toHaveBeenCalledWith(actions[0], rule, e);
  });

  it('does not throw an error when no actions exist', function () {
    var executeDelegateModule = emptyFn;
    var logActionError = emptyFn;
    var logRuleCompleted = emptyFn;

    var rule = {};
    var syntheticEvent = {};

    createRunActions(
      executeDelegateModule,
      logActionError,
      logRuleCompleted
    )(rule, syntheticEvent);
  });
});
