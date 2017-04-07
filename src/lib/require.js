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

var noop = function() {};

/**
 * We expose this as a lib file within the built turbine npm package for consumption by extensions.
 * Extensions may use it during testing either directly or indirectly (through turbine-loader)
 * to inject Turbine core modules into extension modules being tested. This is not intended to be
 * used within the engine.
 */
module.exports = require('../createPublicRequire')({
  logger: {
    log: noop,
    info: noop,
    warn: noop,
    error: noop
  },
  buildInfo: {
    turbineVersion: '16.0.0',
    turbineBuildDate: '2016-07-01T18:10:34Z',
    buildDate: '2016-08-01T12:10:33Z',
    environment: 'development'
  },
  propertySettings: {
    domains: [
      'adobe.com',
      'example.com'
    ],
    linkDelay: 100,
    euCookieName: 'sat_track',
    undefinedVarsReturnEmpty: false
  },
  getExtensionConfiguration: noop,
  getSharedModuleExports: noop,
  getHostedLibFileUrl: function(file) { return '//example.com/' + file; }
});
