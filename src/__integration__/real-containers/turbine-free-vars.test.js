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
const loadHtml = require('../load-page-environment-html');
const { test, expect } = require('@playwright/test');
const setupTurbineEventListener = require('./setup-turbine-event-listener');

test('Verify turbine-free-vars rules', async ({ page }) => {
  await loadHtml({ page });
  const expectedActionIds = [
    'TurbineFreeVars::turbine_cc_data_element-pass::thrownError',
    'TurbineEventCustomCodeRule::sequence-event-js-1-pass::thrownError',
    'TurbineEventCustomCodeRule::sequence-event-js-2-pass',
    'TurbineConditionCustomCodeRule::sequence-condition-js-1-pass::thrownError',
    'TurbineConditionCustomCodeRule::sequence-action-js-1-pass',
    'TurbineEmbeddedActionCustomCodeRule::sequence-action-js-1-pass::thrownError',
    'TurbineLinkedActionCustomCode::sequence-action-js-1-pass::thrownError'
  ];
  const resultsPromise = setupTurbineEventListener({
    page,
    expectedActionIds
  });

  // Inject the script dynamically (don't navigate away)
  await page.addScriptTag({
    url: libraryBuildPathsFile.TURBINE_FREE_VARS_CONTAINER.libraryLink
  });

  // TODO: this doesn't look at order at all. is that a problem or do we
  //  just care if we see them all?
  const { expectedActionsFound, unexpectedActionsFound } = await resultsPromise;
  expect(expectedActionsFound.length).toBe(expectedActionIds.length);
  expectedActionsFound.forEach(({ actionId: a }) => {
    expect(expectedActionIds.includes(a)).toBe(true);
  });
  expect(unexpectedActionsFound.length).toBe(0);
});

// test('Verify Turbine DataElement Custom Code Rule', async ({ page }) => {
//   await loadHtml({ page });
//   const expectedActionIds = ['TurbineFreeVars::turbine_cc_data_element-pass::thrownError'];
//   const resultsPromise = setupTurbineEventListener({
//     page,
//     expectedActionIds
//   });
//
//   // Inject the script dynamically (don't navigate away)
//   await page.addScriptTag({
//     url: libraryBuildPathsFile.TURBINE_FREE_VARS_CONTAINER.libraryLink
//   });
//
//   const { expectedActionsFound, unexpectedActionsFound } = await resultsPromise;
//   expect(expectedActionsFound.map((a) => a.actionId)).toEqual(
//     expectedActionIds
//   );
//   expect(unexpectedActionsFound.length).toBe(0);
// });
//
// test.only('Verify Turbine Custom Event Code Rule', async ({ page }) => {
//   await loadHtml({ page });
//   const expectedActionIds = [
//     'TurbineEventCustomCodeRule::sequence-event-js-1-pass::thrownError',
//     'TurbineEventCustomCodeRule::sequence-event-js-2-pass'
//   ];
//   const resultsPromise = setupTurbineEventListener({
//     page,
//     expectedActionIds
//   });
//
//   // Inject the script dynamically (don't navigate away)
//   await page.addScriptTag({
//     url: libraryBuildPathsFile.TURBINE_FREE_VARS_CONTAINER.libraryLink
//   });
//
//   const { expectedActionsFound, unexpectedActionsFound } = await resultsPromise;
//   expect(expectedActionsFound.map((a) => a.actionId)).toEqual(
//     expectedActionIds
//   );
//   expect(unexpectedActionsFound.length).toBe(0);
// });
//
// test('Verify Turbine Condition Custom Code Rule', async ({ page }) => {
//   await loadHtml({ page });
//   const expectedActionIds = [
//     'TurbineConditionCustomCodeRule::sequence-condition-js-1-pass::thrownError',
//     'TurbineConditionCustomCodeRule::sequence-action-js-1-pass'
//   ];
//   const resultsPromise = setupTurbineEventListener({
//     page,
//     expectedActionIds
//   });
//
//   // Inject the script dynamically (don't navigate away)
//   await page.addScriptTag({
//     url: libraryBuildPathsFile.TURBINE_FREE_VARS_CONTAINER.libraryLink
//   });
//
//   const { expectedActionsFound, unexpectedActionsFound } = await resultsPromise;
//   expect(expectedActionsFound.map((a) => a.actionId)).toEqual(
//     expectedActionIds
//   );
//   expect(unexpectedActionsFound.length).toBe(0);
// });
//
// test('Verify Turbine Embedded Action Custom Code Rule', async ({ page }) => {
//   await loadHtml({ page });
//   const expectedActionIds = [
//     'TurbineEmbeddedActionCustomCodeRule::sequence-action-js-1-pass::thrownError'
//   ];
//   const resultsPromise = setupTurbineEventListener({
//     page,
//     expectedActionIds
//   });
//
//   // Inject the script dynamically (don't navigate away)
//   await page.addScriptTag({
//     url: libraryBuildPathsFile.TURBINE_FREE_VARS_CONTAINER.libraryLink
//   });
//
//   const { expectedActionsFound, unexpectedActionsFound } = await resultsPromise;
//   expect(expectedActionsFound.map((a) => a.actionId)).toEqual(
//     expectedActionIds
//   );
//   expect(unexpectedActionsFound.length).toBe(0);
// });
//
// test('Verify Turbine Linked Action Custom Code Rule', async ({ page }) => {
//   await loadHtml({ page });
//   const expectedActionIds = [
//     'TurbineLinkedActionCustomCode::sequence-action-js-1-pass::thrownError'
//   ];
//   const resultsPromise = setupTurbineEventListener({
//     page,
//     expectedActionIds
//   });
//
//   // Inject the script dynamically (don't navigate away)
//   await page.addScriptTag({
//     url: libraryBuildPathsFile.TURBINE_FREE_VARS_CONTAINER.libraryLink
//   });
//
//   const { expectedActionsFound, unexpectedActionsFound } = await resultsPromise;
//   expect(expectedActionsFound.map((a) => a.actionId)).toEqual(
//     expectedActionIds
//   );
//   expect(unexpectedActionsFound.length).toBe(0);
// });
