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

const containerTypes = {
  ACTION_SEQUENCE_CONTAINER: require('./generate-action-sequence-container'),
  TURBINE_CHECKS_CDN_DISABLED: require('./generate-turbine-checks-container-dynamic-cdn-disabled')
};

// Function that returns the build library URL
const buildLibrary = async (containerType) => {
  console.log(`Building ${containerType}...`);
  // invoke the generateContainer function.
  const { success, error, ...rest } = await containerTypes[containerType]();

  if (success) {
    const { libraryLink, propertyLink, propertyName } = rest;
    console.log(
      `Successfully generated ${containerType} container:`,
      libraryLink
    );
    return {
      libraryLink,
      propertyLink,
      propertyName
    };
  } else {
    console.error(`Failed to generate "${containerType}" container:`, error);
    throw new Error(
      `Failed to generate "${containerType}" container: ${error}`
    );
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

// Check all container URLs
(async () => {
  const containerTypeNames = Object.keys(containerTypes);
  const forceBuild = process.argv.includes('--force');

  const saveLibraryDetails = (type, details) => {
    if (!Object.keys(details).length) {
      throw new Error('The details used to save to the JSON file were empty');
    }
    libraryBuildPathJson[type] = details;
    jsonModified = true;
  };

  let current = 1;
  for (const containerType of containerTypeNames) {
    console.log(
      `Processing ${containerType} (container ${current}/${containerTypeNames.length})`
    );
    let { libraryLink } = libraryBuildPathJson[containerType] || {};
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
        propertyName
      } = await buildLibrary(containerType);
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
      saveLibraryDetails(containerType, {
        libraryLink: freshLibraryLink,
        propertyLink,
        propertyName
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
      'JSON was unmodified - All container types were publicly accessible'
    );
  }

  console.log('All container URLs processed successfully');
})();
