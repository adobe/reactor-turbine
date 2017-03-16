/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

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
