/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

var JS_EXTENSION = '.js';

/**
 * @private
 * Returns the directory of a path. A limited version of path.dirname in nodejs.
 *
 * To keep it simple, it makes the following assumptions:
 * path has a least one slash
 * path does not end with a slash
 * path does not have empty segments (e.g., /src/lib//foo.bar)
 *
 * @param {string} path
 * @returns {string}
 */
var dirname = function(path) {
  return path.substr(0, path.lastIndexOf('/'));
};

/**
 * Determines if a string ends with a certain string.
 * @param {string} str The string to test.
 * @param {string} suffix The suffix to look for at the end of str.
 * @returns {boolean} Whether str ends in suffix.
 */
var endsWith = function(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

/**
 * Given a starting path and a path relative to the starting path, returns the final path. A
 * limited version of path.resolve in nodejs.
 *
 * To keep it simple, it makes the following assumptions:
 * fromPath has at least one slash
 * fromPath does not end with a slash.
 * fromPath does not have empty segments (e.g., /src/lib//foo.bar)
 * relativePath starts with ./ or ../
 *
 * @param {string} fromPath
 * @param {string} relativePath
 * @returns {string}
 */
module.exports = function(fromPath, relativePath) {
  // Handle the case where the relative path does not end in the .js extension. We auto-append it.
  if (!endsWith(relativePath, JS_EXTENSION)) {
    relativePath = relativePath + JS_EXTENSION;
  }

  var relativePathSegments = relativePath.split('/');
  var resolvedPathSegments = dirname(fromPath).split('/');

  relativePathSegments.forEach(function(relativePathSegment) {
    if (!relativePathSegment || relativePathSegment === '.') {
      return;
    } else if (relativePathSegment === '..') {
      if (resolvedPathSegments.length) {
        resolvedPathSegments.pop();
      }
    } else {
      resolvedPathSegments.push(relativePathSegment);
    }
  });

  return resolvedPathSegments.join('/');
};
