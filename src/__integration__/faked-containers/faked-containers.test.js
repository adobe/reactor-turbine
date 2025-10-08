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

const { test, expect } = require('@playwright/test');
const createSimpleIntegrationContainers = require('./createSimpleIntegrationContainers');
const loadContainer = require('./loadContainerForTest');

/* eslint-disable max-len */

test.describe('Integration: dist/engine.js', () => {
  test.beforeEach(async ({ page }) => {
    // capture console log messages from the browser context for debugging
    page.on('console', (msg) => console.log('[BROWSER]', msg.text()));
    await page.evaluate(() => {
      delete window._satellite;
      delete window.__original_satellite_reference;
      delete window.__satelliteLoaded;
      delete window.customActionSourceValue;
    });
  });

  test.describe('_satellite startup', () => {
    test.beforeEach(async ({ page }) => {
      await loadContainer({
        page,
        container: createSimpleIntegrationContainers.bareBonesContainer()
      });
    });

    test('should have expected _satellite functions', async ({ page }) => {
      await expect(
        page.evaluate(() => window._satellite),
        'Expected window._satellite to be defined.'
      ).resolves.toBeDefined();
      await expect(
        page.evaluate(() => window._satellite.property),
        'Expected window._satellite.property to be defined.'
      ).resolves.toBeDefined();
      await expect(
        page.evaluate(() => window._satellite.buildInfo),
        'Expected window._satellite.buildInfo to be defined.'
      ).resolves.toBeDefined();
      await expect(
        page.evaluate(() => window._satellite.environment),
        'Expected window._satellite.environment to be defined.'
      ).resolves.toBeDefined();
      await expect(
        page.evaluate(() => window._satellite.cookie),
        'Expected window._satellite.cookie to be defined.'
      ).resolves.toBeDefined();
      // NOTE: logger.deprecation is used internally to Turbine but not granted to extension developers
      // through window._satellite.logger nor through the turbine free variable.
      await expect(
        page.evaluate(() => window._satellite.logger),
        'Expected window._satellite.logger to be defined.'
      ).resolves.toBeDefined();
      await expect(
        page.evaluate(() => typeof window._satellite.logger.log),
        'Expected window._satellite.logger.log to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.logger.debug),
        'Expected window._satellite.logger.debug to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.logger.warn),
        'Expected window._satellite.logger.warn to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.logger.error),
        'Expected window._satellite.logger.error to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.readCookie),
        'Expected window._satellite.readCookie to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.removeCookie),
        'Expected window._satellite.removeCookie to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.setCookie),
        'Expected window._satellite.setCookie to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.pageBottom),
        'Expected window._satellite.pageBottom to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.notify),
        'Expected window._satellite.notify to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.getVisitorId),
        'Expected window._satellite.getVisitorId to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.track),
        'Expected window._satellite.track to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.setVar),
        'Expected window._satellite.setVar to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.getVar),
        'Expected window._satellite.getVar to be defined.'
      ).resolves.toBe('function');
      await expect(
        page.evaluate(() => typeof window._satellite.setDebug),
        'Expected window._satellite.setDebug to be defined.'
      ).resolves.toBe('function');
    });

    test('Can call setVar and getVar', async ({ page }) => {
      await expect(
        page.evaluate(() => window._satellite.getVar)
      ).resolves.toBeFalsy();
      await page.evaluate(() => window._satellite.setVar('testVar', 123));
      await expect(
        page.evaluate(() => window._satellite.getVar('testVar')),
        'Expected getVar to return 123'
      ).resolves.toBe(123);
    });

    test('should have the proper shape for _satellite.environment', async ({
      page
    }) => {
      await expect(
        page.evaluate(() => window._satellite.environment)
      ).resolves.toEqual({ stage: 'development' });
    });

    test('should have the proper shape for _satellite.buildInfo', async ({
      page
    }) => {
      await expect(
        page.evaluate(() => window._satellite.buildInfo)
      ).resolves.toEqual({
        turbineVersion: '1.0.0-testing'
      });
    });
  });

  test.describe('tests a basic event/condition/action loop works', () => {
    /*
     * integration-test-module/src/lib/events/simpleEventTrigger.js adds a click listener to document.body.
     * if core/src/lib/condition/alwaysTrue.js fails in some way
     * or integration-test-module/src/lib/actions/customActionSource.js doesn't run and set window.customActionSourceValue
     * then this test will time out.
     */

    // where false/true represent ruleComponentSequencingEnabled being off/on
    [false, true].forEach((ruleComponentSequencingEnabled) => {
      test.describe(`with ruleComponentSequencingEnabled: ${ruleComponentSequencingEnabled}`, () => {
        test('can run a simple event/condition/action loop', async ({
          page
        }) => {
          await expect(
            page.evaluate(() => typeof window.customActionSourceValue)
          ).resolves.toBe('undefined');

          const expectedValue = `integration-test-module:sequencingEnabled-${ruleComponentSequencingEnabled}:data:element:value`;

          // Step 1: Create container and load it
          const container =
            createSimpleIntegrationContainers.simpleEventConditionActionContainer(
              {
                ruleComponentSequencingEnabled,
                customActionWindowVariable: 'customActionSourceValue'
              }
            );
          await loadContainer({
            page,
            container
          });

          // Step 2: Create a Promise and store its resolve outside
          let resolveValueSet;
          const valueSetPromise = new Promise((resolve) => {
            resolveValueSet = resolve;
          });

          // Step 3: Expose function that resolves the promise
          await page.exposeFunction('notifyTestOfSetValue', (value) => {
            if (value === expectedValue) {
              resolveValueSet();
            }
          });

          // Step 4: Define observable property
          await page.evaluate(() => {
            let internalValue;
            Object.defineProperty(window, 'customActionSourceValue', {
              configurable: true,
              enumerable: true,
              get() {
                return internalValue;
              },
              set(value) {
                internalValue = value;
                if (window.notifyTestOfSetValue) {
                  window.notifyTestOfSetValue(value);
                }
              }
            });
          });

          // Step 5: Dispatch click event
          await page.evaluate(() => {
            const event = new MouseEvent('click', { bubbles: true });
            document.body.dispatchEvent(event);
          });

          // Step 6: Wait for value to be set (or timeout)
          await Promise.race([
            valueSetPromise,
            new Promise((_, reject) =>
              setTimeout(
                () =>
                  reject(new Error('Timed out waiting for value to be set')),
                2000
              )
            )
          ]);
        });
      });
    });
  });
});
