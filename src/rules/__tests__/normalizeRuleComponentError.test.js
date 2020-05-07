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

var normalizeRuleComponentError = require('../normalizeRuleComponentError');

describe('normalizeRuleComponentError', function () {
  it('returns the same error it receives', function () {
    var e = new Error('some error');
    expect(normalizeRuleComponentError(e)).toEqual(e);
  });

  it('returns a default error when no error is received', function () {
    expect(normalizeRuleComponentError()).toEqual(
      new Error(
        'The extension triggered an error, but no error information was provided.'
      )
    );
  });

  it('returns an error when a string is received', function () {
    expect(normalizeRuleComponentError('some other error')).toEqual(
      new Error('some other error')
    );
  });
});
