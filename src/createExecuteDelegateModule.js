/***************************************************************************************
 * (c) 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

var MODULE_NOT_FUNCTION_ERROR = 'Module did not export a function.';

module.exports = function(moduleProvider, replaceTokens) {
  return function(moduleDescriptor, syntheticEvent, moduleCallParameters) {
    moduleCallParameters = moduleCallParameters || [];
    var moduleExports = moduleProvider.getModuleExports(
      moduleDescriptor.modulePath
    );

    if (typeof moduleExports !== 'function') {
      throw new Error(MODULE_NOT_FUNCTION_ERROR);
    }

    var settings = replaceTokens(
      moduleDescriptor.settings || {},
      syntheticEvent
    );
    return moduleExports.bind(null, settings).apply(null, moduleCallParameters);
  };
};
