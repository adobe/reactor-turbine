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

test('Verify a Basic Action Sequence using a promise from a EP', async ({
  page
}) => {
  await loadHtml({ page });
  const expectedActionIds = [
    'EPActionPromiseRule::sequence-action-js-1-pass',
    'EPActionPromiseRule::sequence-action-js-2-pass',
    'EPActionPromiseRule::sequence-action-js-3-pass'
  ];
  const resultsPromise = setupTurbineEventListener({
    page,
    expectedActionIds
  });

  // Inject the script dynamically (don't navigate away)
  await page.addScriptTag({
    url: libraryBuildPathsFile.ACTION_SEQUENCING_ENABLED.libraryLink
  });

  const { expectedActionsFound, unexpectedActionsFound } = await resultsPromise;
  expect(expectedActionsFound.map((a) => a.actionId)).toEqual(
    expectedActionIds
  );
  expect(unexpectedActionsFound.length).toBe(0);
});

test('Verify Failure Action Sequence using a promise from a EP', async ({
  page
}) => {
  await loadHtml({ page });

  const expectedActionIds = [
    'EPActionPromiseRuleFailure::sequence-action-js-1-pass'
  ];
  const unexpectedActionIds = [
    'EPActionPromiseRuleFailure::sequence-action-js-3-fail'
  ];
  const resultsPromise = setupTurbineEventListener({
    page,
    expectedActionIds,
    unexpectedActionIds
  });

  // Inject the script dynamically (don't navigate away)
  await page.addScriptTag({
    url: libraryBuildPathsFile.ACTION_SEQUENCING_ENABLED.libraryLink
  });

  const { expectedActionsFound, unexpectedActionsFound } = await resultsPromise;
  expect(expectedActionsFound.map((a) => a.actionId)).toEqual(
    expectedActionIds
  );
  expect(unexpectedActionsFound.length).toBe(0);
});

test('Verify Basic Action Sequence using a Promise in JS Custom code', async ({
  page
}) => {
  await loadHtml({ page });
  const expectedActionIds = [
    'JSActionCustomCodeRule::sequence-action-js-1-pass',
    'JSActionCustomCodeRule::sequence-action-js-2-pass',
    'JSActionCustomCodeRule::sequence-action-js-3-pass'
  ];
  const resultsPromise = setupTurbineEventListener({
    page,
    expectedActionIds
  });

  // Inject the script dynamically (don't navigate away)
  await page.addScriptTag({
    url: libraryBuildPathsFile.ACTION_SEQUENCING_ENABLED.libraryLink
  });

  const { expectedActionsFound, unexpectedActionsFound } = await resultsPromise;
  expect(expectedActionsFound.map((a) => a.actionId)).toEqual(
    expectedActionIds
  );
  expect(unexpectedActionsFound.length).toBe(0);
});

test('Verify Action Sequence using a onCustomCodeSuccess() in HTML Custom code', async ({
  page
}) => {
  await loadHtml({ page });
  const expectedActionIds = [
    'HTMLActionCustomCodeRuleOnSuccess::sequence-action-html-1-pass',
    'HTMLActionCustomCodeRuleOnSuccess::sequence-action-html-2-pass',
    'HTMLActionCustomCodeRuleOnSuccess::sequence-action-html-3-pass'
  ];
  const resultsPromise = setupTurbineEventListener({
    page,
    expectedActionIds
  });

  // Inject the script dynamically (don't navigate away)
  await page.addScriptTag({
    url: libraryBuildPathsFile.ACTION_SEQUENCING_ENABLED.libraryLink
  });

  const { expectedActionsFound, unexpectedActionsFound } = await resultsPromise;
  expect(expectedActionsFound.map((a) => a.actionId)).toEqual(
    expectedActionIds
  );
  expect(unexpectedActionsFound.length).toBe(0);
});

test('Verify Failure of an Action Sequence using onCustomCodeFailure() in HTML Custom code', async ({
  page
}) => {
  await loadHtml({ page });
  const expectedActionIds = [
    'HTMLActionCustomCodeRuleOnFail::sequence-action-html-1-pass'
  ];
  const unexpectedActionIds = [
    'HTMLActionCustomCodeRuleOnFail::sequence-action-html-3-fail'
  ];
  const resultsPromise = setupTurbineEventListener({
    page,
    expectedActionIds,
    unexpectedActionIds
  });

  // Inject the script dynamically (don't navigate away)
  await page.addScriptTag({
    url: libraryBuildPathsFile.ACTION_SEQUENCING_ENABLED.libraryLink
  });

  const { expectedActionsFound, unexpectedActionsFound } = await resultsPromise;
  expect(expectedActionsFound.map((a) => a.actionId)).toEqual(
    expectedActionIds
  );
  expect(unexpectedActionsFound.length).toBe(0);
});
