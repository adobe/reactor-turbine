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

var createGetExtensionSettings = require('./createGetExtensionSettings');
var createGetHostedLibFileUrl = require('./createGetHostedLibFileUrl');
var logger = require('./logger');
var scopedTurbine = {};


module.exports = function(container, replaceTokens, getDataElementValue) {
  var extensions = container.extensions;
  var buildInfo = container.buildInfo;
  var propertySettings = container.property.settings;

  if (extensions) {
    Object.keys(extensions).forEach(function(extensionName) {
      var extension = extensions[extensionName];
      var getExtensionSettings = createGetExtensionSettings(replaceTokens, extension.settings);

      var prefixedLogger = logger.createPrefixedLogger(extension.displayName);
      var getHostedLibFileUrl = createGetHostedLibFileUrl(
        extension.hostedLibFilesBaseUrl,
        buildInfo.minified
      );

      scopedTurbine[extensionName] = {
        buildInfo: buildInfo,
        getSharedModule: function() {},
        getDataElementValue: getDataElementValue,
        getExtensionSettings: getExtensionSettings,
        getHostedLibFileUrl: getHostedLibFileUrl,
        logger: prefixedLogger,
        propertySettings: propertySettings,
        replaceTokens: replaceTokens
      };
    });
  }

  return scopedTurbine;
};
