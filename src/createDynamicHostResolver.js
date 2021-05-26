/***************************************************************************************
 * (c) 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

module.exports = function (turbineEmbedCode, isDynamicEnforced, logger) {
  var turbineUrl;

  try {
    // TODO: web only? I think embedded TVs wouldn't have
    //  __satellite.container.dynamicEnforced turned on
    turbineUrl = new URL(turbineEmbedCode);
  } catch (e) {
    if (isDynamicEnforced === true) {
      // TODO: this should not stay as "deprecation", but it allows us to
      //  force messages to the console
      logger.deprecation(
        'Unable to find the Library Embed Code for Dynamic Host Resolution.'
      );
    }
  }

  var shouldAugment = Boolean(isDynamicEnforced && turbineUrl);

  /**
   * Returns the host of the Turbine embed code, or an empty string if Dynamic Host
   * is not enabled.
   * @returns {string}
   */
  var getTurbineHost = function () {
    if (shouldAugment) {
      // be sure we always force https to Adobe managed domains
      return 'https://' + turbineUrl.host;
    }

    return '';
  };

  /**
   * Returns a url decorated with the host of the Turbine embed code. If Dynamic host
   * is disabled, the original sourceUrl is returned unmodified.
   * @param sourceUrl
   * @returns {string|*}
   */
  var decorateWithDynamicHost = function (sourceUrl) {
    if (shouldAugment) {
      var urlParts = [
        getTurbineHost(),
        sourceUrl.charAt(0) === '/' ? sourceUrl.slice(1) : sourceUrl
      ];

      return urlParts.join('/');
    }

    return sourceUrl;
  };

  return {
    getTurbineHost: getTurbineHost,
    decorateWithDynamicHost: decorateWithDynamicHost
  };
};
