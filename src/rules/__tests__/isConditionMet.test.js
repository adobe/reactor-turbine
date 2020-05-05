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

var isConditionMet = require('../isConditionMet');

describe('isConditionMet', function () {
  it('returns true when result is truthy and condition negate is false', function () {
    expect(isConditionMet({ negate: false }, true)).toBeTrue();
  });

  it('returns false when result is not truthy and condition negate is false', function () {
    expect(isConditionMet({ negate: false }, false)).toBeFalse();
  });

  it('returns true when result is not truthy and condition negate is true', function () {
    expect(isConditionMet({ negate: true }, false)).toBeTrue();
  });

  it('returns false when result is truthy and condition negate is true', function () {
    expect(isConditionMet({ negate: true }, true)).toBeFalse();
  });
});
