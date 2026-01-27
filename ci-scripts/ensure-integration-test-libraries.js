#!/usr/bin/env node

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

const path = require('path');
const libraryBuildPathsFile = path.join(__dirname, 'library-build-paths.json');

const fs = require('fs');
const packageJson = require(path.join(__dirname, '..', 'package.json'));
const thisTurbineVersion = packageJson.version;

const turbineLogicTestVariants = {
  ACTION_SEQUENCING_ENABLED: require('./test-variant-generators/action-sequencing-enabled'),
  ACTION_SEQUENCING_DISABLED: require('./test-variant-generators/action-sequencing-disabled'),
  TURBINE_CHECKS_CDN_DISABLED: require('./test-variant-generators/turbine-behaviors-prem-cdn-disabled'),
  TURBINE_CHECKS_CDN_ENABLED: require('./test-variant-generators/turbine-behaviors-prem-cdn-enabled')
};

// Function that returns the build library URL
const buildLibrary = async (testVariant) => {
  console.log(`Building ${testVariant}...`);
  // invoke the generateContainer function.
  const libraryGeneratorFunc = turbineLogicTestVariants[testVariant];
  const { success, error, ...rest } = await libraryGeneratorFunc();

  if (success) {
    const { libraryLink, propertyLink, propertyName, premiumCdnLink } = rest;
    console.log(`Successfully generated ${testVariant} library:`, libraryLink);
    return {
      libraryLink,
      propertyLink,
      propertyName,
      premiumCdnLink
    };
  } else {
    console.error(`Failed to generate "${testVariant}" library:`, error);
    throw new Error(`Failed to generate "${testVariant}" library: ${error}`);
  }
};

if (!fs.existsSync(libraryBuildPathsFile)) {
  console.log(
    'library-build-paths.json does not exist in ci-scripts directory. Creating it...'
  );
  // Create the file with an empty object as initial content
  fs.writeFileSync(libraryBuildPathsFile, JSON.stringify({}, null, 2));
  console.log(
    'library-build-paths.json has been created successfully in ci-scripts directory.'
  );
}

console.log('Checking URLs...');

const libraryBuildPathJson = require('./library-build-paths.json');
let jsonModified = false;

// Function to check if a URL returns valid content
const checkUrl = async (url) => {
  try {
    if (!url?.length) {
      return false;
    }

    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (response.ok) {
      console.log(`✓ Successfully loaded JS file from: ${url}`);

      const text = await response.text();
      const [, libraryTurbineVersion] = text.match(
        /"turbineVersion"\s*:\s*"([^"]+)"/
      );
      if (libraryTurbineVersion) {
        const isValid = libraryTurbineVersion === thisTurbineVersion;
        if (!isValid) {
          console.log('Turbine version mismatch for', url);
          console.log('This Turbine Version:', thisTurbineVersion);
          console.log('Library Turbine version:', libraryTurbineVersion);
        } else {
          console.log(
            `✅ ---Turbine version for the built library matches local version ${thisTurbineVersion}---`
          );
        }
        return isValid;
      } else {
        throw new Error('turbineVersion not found in JS file');
      }
    } else {
      throw new Error(
        `Failed to load JS file at ${url}. Status code: ${response.status}`
      );
    }
  } catch (err) {
    if (err.name === 'TimeoutError') {
      throw new Error(`Request timeout for ${url}`);
    }
    throw new Error(`Error loading JS file at ${url}: ${err.message}`);
  }
};

// Check all test variant library URLs
(async function ensureLibraryBuildsForIntegration() {
  const testVariantNames = Object.keys(turbineLogicTestVariants);
  const forceBuild = process.argv.includes('--force');

  // update a JSON object to be written back to disk at the end
  const setLibraryDetailsToSave = (type, details) => {
    if (!Object.keys(details).length) {
      throw new Error('The details used to save to the JSON file were empty');
    }
    // not every company will support having a premium cdn link. ensure we don't save an undefined.
    if (
      !details.hasOwnProperty('premiumCdnLink') &&
      !details.premiumCdnLink?.length
    ) {
      delete details.premiumCdnLink;
    }
    libraryBuildPathJson[type] = details;
    jsonModified = true;
  };

  let current = 1;
  for (const testVariantName of testVariantNames) {
    console.log(
      `Processing ${testVariantName} (library ${current}/${testVariantNames.length})`
    );
    let { libraryLink } = libraryBuildPathJson[testVariantName] || {};
    let isValid = false;

    // we have a prior build url, see if the url is valid
    // if forcing builds, skip the first validity check
    if (!forceBuild && libraryLink) {
      isValid = await checkUrl(libraryLink);
    }

    if (!isValid) {
      let {
        libraryLink: freshLibraryLink,
        propertyLink,
        propertyName,
        premiumCdnLink
      } = await buildLibrary(testVariantName);
      if (freshLibraryLink.includes('.min.js')) {
        freshLibraryLink = freshLibraryLink.replace('.min.js', '.js');
      }
      const isNewBuildValid = await checkUrl(freshLibraryLink);
      if (!isNewBuildValid) {
        throw new Error(
          'We just built a new library and the Turbine versions still do not match. New Build URL was ' +
            freshLibraryLink
        );
      }
      setLibraryDetailsToSave(testVariantName, {
        libraryLink: freshLibraryLink,
        propertyLink,
        propertyName,
        premiumCdnLink
      });
    }

    current++;
  }

  // Write back to file if JSON was modified
  if (jsonModified) {
    fs.writeFileSync(
      libraryBuildPathsFile,
      JSON.stringify(libraryBuildPathJson, null, 2)
    );
    console.log('Updated library-build-paths.json with new URLs');
  } else {
    console.log(
      'JSON was unmodified - All test variant libraries were publicly accessible'
    );
  }

  console.log('All test variant library URLs processed successfully');
})();
