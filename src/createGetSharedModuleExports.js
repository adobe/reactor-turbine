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

var validateInjectedParams = require('./helpers/validate-injected-params');

function injectCreateGetSharedModuleExports({ logger }) {
  /**
   * Creates a function that, when called with an extension name and module name, will return the
   * exports of the respective shared module.
   *
   * @param {Object} extensions
   * @param {Object} moduleProvider
   * @returns {Function}
   */
  return function createGetSharedModuleExports(extensions, moduleProvider) {
    return function getSharedModuleExports(extensionName, moduleName) {
      var extension = extensions[extensionName];

      if (extension) {
        var modules = extension.modules;
        if (modules) {
          var referencePaths = Object.keys(modules);
          for (var i = 0; i < referencePaths.length; i++) {
            var referencePath = referencePaths[i];
            var module = modules[referencePath];
            if (module.shared && module.name === moduleName) {
              return moduleProvider.getModuleExports(referencePath);
            }
          }
          logger.error(
            `The module "${moduleName}" does not exist in the shared modules of the "${extensionName}" extension`
          );
        }
      } else {
        logger.error(
          `The extension "${extensionName}" is not bundled with the library."`
        );
      }
    };
  };
}

const validateInjection = validateInjectedParams(
  injectCreateGetSharedModuleExports
);

module.exports = validateInjection({
  logger: require('./logger')
});

if (REACTOR_KARMA_CI_UNIT_TEST_MODE) {
  /* START.TESTS_ONLY */
  module.exports.injectCreateGetSharedModuleExports =
    injectCreateGetSharedModuleExports;
  /* END.TESTS_ONLY */
}
