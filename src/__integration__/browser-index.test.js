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

describe('Integration: dist/engine.js', () => {
  let initialSatelliteReference;
  beforeAll((done) => {
    // Simulate a container being present before index.js is imported
    window._satellite = {
      container: {
        buildInfo: {},
        company: {
          dynamicCdnEnabled: false,
          cdnAllowList: []
        },
        property: {
          settings: {
            undefinedVarsReturnEmpty: false,
            ruleComponentSequencingEnabled: true
          }
        },
        environment: {
          stage: 'development'
        },
        dataElements: {},
        rules: []
      }
    };
    initialSatelliteReference = window._satellite;

    const script = document.createElement('script');
    script.src = '/base/dist/engine.js'; // '/base/' is Karma's base URL prefix
    script.onload = () => done();
    script.onerror = (e) => done.fail(`Failed to load engine.js: ${e.message}`);
    document.body.appendChild(script);
  });

  fit('window._satellite should be decorated without the reference changing', async () => {
    expect(window._satellite).toBe(initialSatelliteReference);
  });

  fit('should have expected _satellite functions', async () => {
    expect(window._satellite)
      .withContext('Expected window._satellite to be defined.')
      .toBeDefined();
    expect(window._satellite.track)
      .withContext('Expected window._satellite.track to be defined.')
      .toBeDefined();
    expect(window._satellite.setVar)
      .withContext('Expected window._satellite.setVar to be defined.')
      .toBeDefined();
    expect(window._satellite.getVar)
      .withContext('Expected window._satellite.getVar to be defined.')
      .toBeDefined();
    expect(window._satellite.setDebug)
      .withContext('Expected window._satellite.setDebug to be defined.')
      .toBeDefined();
  });
});
