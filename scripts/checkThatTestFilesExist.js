#!/usr/bin/env node

/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

const path = require('path');
const fs = require('fs');
const recursive = require('recursive-readdir');
const { Minimatch } = require('minimatch');
const ignorePatterns = require('../coverageignore');

const baseDir = path.join(__dirname, '../');
const srcDir = path.join(__dirname, '../src');
const testFolderName = '__tests__';
const srcFileExtension = '.js';
const specExtension = '.test.js';

const ignoreMinimatches = ignorePatterns.map((ignorePattern) => {
  return new Minimatch(ignorePattern);
});

const shouldFileBeIgnored = (file) => {
  return ignoreMinimatches.some((minimatch) => {
    return minimatch.match(path.relative(srcDir, file));
  });
};

/**
 * Ensures that for every source file there's an accompanying spec file.
 * If not, the missing spec files will be listed and the process will
 * exit with an exit code of 1.
 */
recursive(srcDir, [shouldFileBeIgnored]).then((srcFiles) => {
  const missingTestFiles = srcFiles
    .map((srcFile) => {
      const pathRelativeToSrcDir = path.relative(srcDir, srcFile);
      const pathToTestFile = path.join(
        path.dirname(pathRelativeToSrcDir), // directories down to __tests__ folder
        testFolderName, // __tests__ folder
        `${path.basename(
          pathRelativeToSrcDir,
          srcFileExtension
        )}${specExtension}` // .test.js
      );

      return path.resolve(srcDir, pathToTestFile);
    })
    .filter((testFile) => {
      return !fs.existsSync(testFile);
    });

  if (missingTestFiles.length) {
    console.error('Test files are missing for their respective source files:');
    missingTestFiles.forEach((missingTestFile) => {
      const pathRelativeToBaseDir = path.relative(baseDir, missingTestFile);
      console.error(`- ${pathRelativeToBaseDir}`);
    });
    process.exitCode = 1;
  }
});
