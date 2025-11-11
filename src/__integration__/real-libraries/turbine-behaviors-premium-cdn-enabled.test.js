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

const libraryBuildPathsFile = require('../../../ci-scripts/library-build-paths.json');
const loadHtml = require('./setup/load-page-environment-html');
const { test, expect } = require('@playwright/test');
const setupTurbineEventListener = require('./setup/setup-turbine-event-listener');

test('Premium CDN is enabled for the testing library', async ({ page }) => {
  await loadHtml({ page });

  // Inject the script dynamically (don't navigate away)
  await page.addScriptTag({
    url: libraryBuildPathsFile.TURBINE_CHECKS_CDN_ENABLED.libraryLink
  });

  await expect(
    page.evaluate(() => window._satellite.company.dynamicCdnEnabled),
    'Expected window._satellite.company.dynamicCdnEnabled to be defined:true.'
  ).resolves.toBe(true);

  const cdnAllowList = await page.evaluate(
    () => window._satellite.company.cdnAllowList
  );
  expect(cdnAllowList.length).toBe(
    2,
    'Expected cdnAllowList to have 2 entries'
  );
  expect(cdnAllowList.includes('assets.adoberesources.cn')).toBe(
    true,
    'Expected cdnAllowList to include assets.adoberesources.cn'
  );
  expect(cdnAllowList.includes('assets.adobedtm.com')).toBe(
    true,
    'Expected cdnAllowList to include assets.adobedtm.com'
  );
});

test.describe('The Dynamic Host Resolver can resolve the urls for hosted files', () => {
  test.describe('with assets.adobedtm.com embed link', () => {
    test('a simple verification of the dynamic host resolver', async ({
      page
    }) => {
      expect(
        libraryBuildPathsFile.TURBINE_CHECKS_CDN_ENABLED.libraryLink.includes(
          'assets.adobedtm.com'
        ),
        'The libraryLink was not on the domain assets.adobedtm.com'
      ).toBe(true);

      await loadHtml({ page });
      // Inject the script dynamically (don't navigate away)
      await page.addScriptTag({
        url: libraryBuildPathsFile.TURBINE_CHECKS_CDN_ENABLED.libraryLink
      });
      // do this toggle to ensure debugEnabled triggers the change within turbine
      // to place the dynamicHostResolver on the window.
      await page.evaluate(() => window._satellite.setDebug(false));
      await page.evaluate(() => window._satellite.setDebug(true));
      await expect(
        page.evaluate(() =>
          window.dynamicHostResolver.decorateWithDynamicHost('/my/file.js')
        ),
        'Expected window.dynamicHostResolver.decorateWithDynamicHost to work.'
      ).resolves.toBe('https://assets.adobedtm.com/my/file.js');
      await page.evaluate(() => window._satellite.setDebug(false));
    });

    test('it can File-Transform a Condition', async ({ page }) => {
      await loadHtml({ page });
      const expectedTestIdentifiers = [
        'PremiumCDNEnabledCustomConditionFileTransform::sequence-action-js-3-pass'
      ];
      const resultsPromise = setupTurbineEventListener({
        page,
        expectedTestIdentifiers
      });

      // Inject the script dynamically (don't navigate away)
      await page.addScriptTag({
        url: libraryBuildPathsFile.TURBINE_CHECKS_CDN_ENABLED.libraryLink
      });

      const { expectedTestIdentifiersFound, unexpectedTestIdentifiersFound } =
        await resultsPromise;
      expect(
        expectedTestIdentifiersFound.map(({ testIdentifier }) => testIdentifier)
      ).toEqual(expectedTestIdentifiers);
      expect(unexpectedTestIdentifiersFound.length).toBe(0);
    });

    test('it can File-Transform an Action', async ({ page }) => {
      await loadHtml({ page });
      const expectedTestIdentifiers = [
        'PremiumCDNEnabledCustomActionFileTransform::sequence-action-js-2-pass'
      ];
      const resultsPromise = setupTurbineEventListener({
        page,
        expectedTestIdentifiers
      });

      // Inject the script dynamically (don't navigate away)
      await page.addScriptTag({
        url: libraryBuildPathsFile.TURBINE_CHECKS_CDN_ENABLED.libraryLink
      });

      const { expectedTestIdentifiersFound, unexpectedTestIdentifiersFound } =
        await resultsPromise;
      expect(
        expectedTestIdentifiersFound.map(({ testIdentifier }) => testIdentifier)
      ).toEqual(expectedTestIdentifiers);
      expect(unexpectedTestIdentifiersFound.length).toBe(0);
    });
  });

  test.describe('with assets.adoberesources.cn embed link', () => {
    test('a simple verification of the dynamic host resolver', async ({
      page
    }) => {
      expect(
        libraryBuildPathsFile.TURBINE_CHECKS_CDN_ENABLED.premiumCdnLink.includes(
          'assets.adoberesources.cn'
        ),
        'The libraryLink was not on the domain assets.adoberesources.cn'
      ).toBe(true);

      await loadHtml({ page });

      // Inject the script dynamically (don't navigate away)
      await page.addScriptTag({
        url: libraryBuildPathsFile.TURBINE_CHECKS_CDN_ENABLED.premiumCdnLink
      });

      // do this toggle to ensure debugEnabled triggers the change within turbine
      // to place the dynamicHostResolver on the window.
      await page.evaluate(() => window._satellite.setDebug(false));
      await page.evaluate(() => window._satellite.setDebug(true));

      await expect(
        page.evaluate(() =>
          window.dynamicHostResolver.decorateWithDynamicHost('/my/file.js')
        ),
        'Expected window.dynamicHostResolver.decorateWithDynamicHost to work.'
      ).resolves.toBe('https://assets.adoberesources.cn/my/file.js');
    });

    test('it can File-Transform a Condition', async ({ page }) => {
      await loadHtml({ page });
      const expectedTestIdentifiers = [
        'PremiumCDNEnabledCustomConditionFileTransform::sequence-action-js-3-pass'
      ];
      const resultsPromise = setupTurbineEventListener({
        page,
        expectedTestIdentifiers
      });

      // Inject the script dynamically (don't navigate away)
      await page.addScriptTag({
        url: libraryBuildPathsFile.TURBINE_CHECKS_CDN_ENABLED.premiumCdnLink
      });

      const { expectedTestIdentifiersFound, unexpectedTestIdentifiersFound } =
        await resultsPromise;
      expect(
        expectedTestIdentifiersFound.map(({ testIdentifier }) => testIdentifier)
      ).toEqual(expectedTestIdentifiers);
      expect(unexpectedTestIdentifiersFound.length).toBe(0);
    });
  });
});
