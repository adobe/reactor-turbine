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

test('Verify turbine is not available in custom code events, conditions, actions', async ({
  page
}) => {
  await loadHtml({ page });
  const expectedActionIds = [
    'TurbineFreeVars::turbine_cc_data_element-pass::thrownError', // in the setup, we called getVar
    'TurbineNotAvailableCustomCodeEvent::sequence-event-js-1::thrownError::pass',
    'TurbineNotAvailableCustomCodeEvent::sequence-action-js-2-pass',
    'TurbineNotAvailableCustomCodeCondition::sequence-condition-js-1::thrownError::pass',
    'TurbineNotAvailableCustomCodeCondition::sequence-action-js-2-pass',
    'TurbineNotAvailableCustomCodeActionEmbedded::sequence-action-js-1::thrownError::pass',
    'TurbineNotAvailableCustomCodeActionLinked::sequence-action-js-1::thrownError::pass'
  ];
  const resultsPromise = setupTurbineEventListener({
    page,
    expectedActionIds
  });

  // Inject the script dynamically (don't navigate away)
  await page.addScriptTag({
    url: libraryBuildPathsFile.TURBINE_CHECKS_CDN_DISABLED.libraryLink
  });

  const { expectedActionsFound, unexpectedActionsFound } = await resultsPromise;
  expect(expectedActionsFound.length).toBe(expectedActionIds.length);
  expectedActionsFound.forEach(({ actionId: a }) => {
    expect(expectedActionIds.includes(a)).toBe(true);
  });
  expect(unexpectedActionsFound.length).toBe(0);
});

test('custom code transforms on standard host (not dynamicCDN)', async ({
  page
}) => {
  await loadHtml({ page });

  await page.addScriptTag({
    url: libraryBuildPathsFile.TURBINE_CHECKS_CDN_DISABLED.libraryLink
  });

  await expect(
    page.evaluate(() => window._satellite.company.dynamicCdnEnabled),
    'Expected window._satellite.company.dynamicCdnEnabled to be defined:false.'
  ).resolves.toBe(false);

  const rules = await page.evaluate(() => window._satellite._container.rules);

  let isLibraryLoadedCustomCodeAssertions = 0;
  let allOtherEventCustomCodeAssertions = 0;

  rules.forEach((rule) => {
    // for simplicity in our library
    expect(rule.events.length).toBe(1);
    expect(rule.actions.length).toBe(1);

    const [event] = rule.events;
    const [action] = rule.actions;

    const isLibraryLoadedOrPageBottomEvent =
      event.modulePath.includes('pageBottom') ||
      event.modulePath.includes('libraryLoaded');
    const isCustomCodeAction = action.modulePath.includes('customCode');
    if (isLibraryLoadedOrPageBottomEvent) {
      if (isCustomCodeAction) {
        expect(action.settings.source.includes('https://')).toBe(false);
        isLibraryLoadedCustomCodeAssertions++;
      }
    } else {
      // every other event type
      if (isCustomCodeAction) {
        expect(action.settings.source.includes('https://')).toBe(true);
        allOtherEventCustomCodeAssertions++;
      }
    }
  });

  expect(isLibraryLoadedCustomCodeAssertions).toBeGreaterThan(0);
  expect(allOtherEventCustomCodeAssertions).toBeGreaterThan(0);
});
