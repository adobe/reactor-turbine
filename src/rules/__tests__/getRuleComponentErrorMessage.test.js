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

var getRuleComponentErrorMessage = require('../getRuleComponentErrorMessage');

describe('getRuleComponentErrorMessage', function () {
  it('returns the error message with a stack', function () {
    var error = new Error('some error');
    expect(
      getRuleComponentErrorMessage('rule component name', 'rule name', error)
    ).toEqual(
      'Failed to execute "rule component name" for "rule name" rule. some error' +
        // IE doesn't support error stacks. This test in IE will behave like the test from below.
        (error.stack ? '\n' + error.stack : '')
    );
  });

  it('returns the error message with a stack', function () {
    expect(
      getRuleComponentErrorMessage('rule component name', 'rule name', {
        message: 'some error'
      })
    ).toEqual(
      'Failed to execute "rule component name" for "rule name" rule. some error'
    );
  });
});
