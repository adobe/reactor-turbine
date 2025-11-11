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

test('Action sequences fire as fast as possible without waiting for a previous promise to resolve', async ({
  page
}) => {
  await loadHtml({ page });

  // I am expecting these to come out of order due to firing as fast as possible,
  // but some with have timeouts
  const expectedTestIdentifiers = [
    'ActionSequencingDisabled::no-timeout::sequence-action-js-2-pass',
    'ActionSequencingDisabled::no-timeout::sequence-action-js-4-pass',
    'ActionSequencingDisabled::with-timeout::sequence-action-js-1-pass',
    'ActionSequencingDisabled::with-timeout::sequence-action-js-3-pass'
  ];

  const resultsPromise = setupTurbineEventListener({
    page,
    expectedTestIdentifiers
    // unexpectedTestIdentifiers: ['ActionSequencingDisabled::with-timeout::sequence-action-js-3-pass']
  });

  // Inject the script dynamically (don't navigate away)
  await page.addScriptTag({
    url: libraryBuildPathsFile.ACTION_SEQUENCING_DISABLED.libraryLink
  });

  const { expectedTestIdentifiersFound, unexpectedTestIdentifiersFound } =
    await resultsPromise;

  expect(
    expectedTestIdentifiersFound.map(({ testIdentifier }) => testIdentifier)
  ).toEqual(expectedTestIdentifiers);
  expect(unexpectedTestIdentifiersFound.length).toBe(0);
});
