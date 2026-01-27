/***************************************************************************************
 * (c) 2025 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

describe(
  'production integrity checks verify default exports contain' +
    'the dependencies these injectable modules require',
  function () {
    describe('createDynamicHostResolver', function () {
      it('should load module.exports without throwing', () => {
        expect(() => {
          require('../../src/createDynamicHostResolver');
        }).not.toThrow();
      });
    });

    describe('createGetDataElementValue', function () {
      it('should load module.exports without throwing', () => {
        expect(() => {
          require('../../src/createGetDataElementValue');
        }).not.toThrow();
      });
    });

    describe('createModuleProvider', function () {
      it('should load module.exports without throwing', () => {
        expect(() => {
          require('../../src/createModuleProvider');
        }).not.toThrow();
      });
    });

    describe('createNotifyMonitors', function () {
      it('should load module.exports without throwing', () => {
        expect(() => {
          require('../../src/createNotifyMonitors');
        }).not.toThrow();
      });
    });

    describe('createPublicRequire', function () {
      it('should load module.exports without throwing', () => {
        expect(() => {
          require('../../src/createPublicRequire');
        }).not.toThrow();
      });
    });

    describe('createReplaceTokens', function () {
      it('should load module.exports without throwing', () => {
        expect(() => {
          require('../../src/createReplaceTokens');
        }).not.toThrow();
      });
    });

    describe('getNamespacedStorage', function () {
      it('should load module.exports without throwing', () => {
        expect(() => {
          require('../../src/getNamespacedStorage');
        }).not.toThrow();
      });
    });

    describe('hydrateModuleProvider', function () {
      it('should load module.exports without throwing', () => {
        expect(() => {
          require('../../src/hydrateModuleProvider');
        }).not.toThrow();
      });
    });

    describe('hydrateSatelliteObject', function () {
      it('should load module.exports without throwing', () => {
        expect(() => {
          require('../../src/hydrateSatelliteObject');
        }).not.toThrow();
      });
    });

    describe('normalizeSyntheticEvent', function () {
      it('should load module.exports without throwing', () => {
        expect(() => {
          require('../../src/rules/normalizeSyntheticEvent');
        }).not.toThrow();
      });
    });
  }
);
