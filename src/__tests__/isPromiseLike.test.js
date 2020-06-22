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

var Promise = require('@adobe/reactor-promise');
var isPromiseLike = require('../isPromiseLike');

describe('isPromiseLike', function () {
  describe('returns true when it', function () {
    it('looks like a promise', function () {
      var promise = { then: function () {} };
      expect(isPromiseLike(promise)).toBeTrue();
    });

    it('is a promise', function () {
      expect(isPromiseLike(new Promise(function () {}))).toBeTrue();
    });
  });

  describe('returns false when it', function () {
    it('is an object that does not resemble a promise', function () {
      var promise = {};
      expect(isPromiseLike(promise)).toBeFalse();
    });

    it('is a primitive value', function () {
      expect(isPromiseLike(5)).toBeFalse();
    });

    it('is null', function () {
      expect(isPromiseLike(null)).toBeFalse();
    });

    it('is undefined', function () {
      expect(isPromiseLike(undefined)).toBeFalse();
    });

    it('is falsy', function () {
      expect(isPromiseLike(false)).toBeFalse();
    });
  });
});
