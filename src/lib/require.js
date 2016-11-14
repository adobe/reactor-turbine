/**
 * We expose this as a lib file within the built turbine npm package for consumption by extensions.
 * Extensions may use it during testing either directly or indirectly (through turbine-loader)
 * to inject Turbine core modules into extension modules being tested. This is not intended to be
 * used within the engine.
 */
module.exports = require('../createPublicRequire')({
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
  getExtensionConfiguration: function() { },
  getSharedModuleExports: function() { },
  getHostedLibFileUrl: function(file) { return '//example.com/' + file; }
});
