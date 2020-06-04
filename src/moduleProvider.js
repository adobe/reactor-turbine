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

var modules = {};

module.exports = {
  registerModules: function (newModules) {
    modules = newModules;

    // All modules are initialized right away (they are run and their exports retrieved)
    // because modules may need to do things before Turbine interacts with their
    // exports. For example, an extension's action module may start loading an external
    // script right away so that the script's code will be available when the action
    // actually gets executed as part of a rule.
    Object.keys(modules).forEach(function (delegateDescriptorId) {
      modules[delegateDescriptorId].getExports();
    });
  },

  getModuleDefinition: function (extensionName, delegateType, delegateName) {
    return modules[extensionName + '::' + delegateType + '::' + delegateName];
  },

  getModuleExports: function (extensionName, delegateType, delegateName) {
    return modules[
      extensionName + '::' + delegateType + '::' + delegateName
    ].getExports();
  }
};
