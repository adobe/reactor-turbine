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

const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const serialize = require('serialize-javascript');
const engineCode = fs.readFileSync(
  path.resolve(__dirname, '../../../dist/engine.js'),
  'utf-8'
);

module.exports = async function loadContainer({ page, container }) {
  // assert window._satellite is not defined
  await expect(page.evaluate(() => window._satellite)).resolves.toBeUndefined();
  await expect(
    page.evaluate(() => Boolean(window.__satelliteLoaded))
  ).resolves.toBe(false);

  // Wrap in IIFE and assign to window just like a real blacksmith container
  const outputCode = `(function () {
  window._satellite = ${serialize(container, { unsafe: true })};
  window.__original_satellite_reference = window._satellite;
})();`;
  const outputFilePath = path.join(__dirname, 'fake-blacksmith-container.js');
  fs.writeFileSync(outputFilePath, outputCode, 'utf-8');
  // load the container as a script, which gets us around serialization limitations of page.evaluate
  await page.addScriptTag({
    content: fs.readFileSync(outputFilePath, 'utf-8')
  });
  // now load the engine as a script
  await page.addScriptTag({ content: engineCode });

  await expect(page.evaluate(() => window._satellite)).resolves.toBeDefined();
  const satelliteNotReplaced = await page.evaluate(() => {
    return window._satellite === window.__original_satellite_reference;
  });
  expect(satelliteNotReplaced).toBe(true);
};
