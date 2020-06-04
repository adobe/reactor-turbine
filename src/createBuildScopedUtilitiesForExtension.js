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

module.exports = function (
  container,
  createPrefixedLogger,
  createGetExtensionSettings,
  createGetHostedLibFileUrl,
  replaceTokens,
  getDataElementValue
) {
  var extensions = container.extensions;
  var buildInfo = container.buildInfo;
  var propertySettings = container.property.settings;

  return function (extensionName) {
    var extension = extensions[extensionName];
    var getExtensionSettings = createGetExtensionSettings(
      replaceTokens,
      extension.settings
    );

    var prefixedLogger = createPrefixedLogger(extension.displayName);
    var getHostedLibFileUrl = createGetHostedLibFileUrl(
      extension.hostedLibFilesBaseUrl,
      buildInfo.minified
    );

    return {
      buildInfo: buildInfo,
      getDataElementValue: getDataElementValue,
      getExtensionSettings: getExtensionSettings,
      getHostedLibFileUrl: getHostedLibFileUrl,
      logger: prefixedLogger,
      propertySettings: propertySettings,
      replaceTokens: replaceTokens
    };
  };
};
