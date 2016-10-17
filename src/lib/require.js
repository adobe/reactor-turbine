/**
 * We expose this as a lib file within the built turbine npm package for consumption by extensions.
 * Extensions may use it during testing either directly or indirectly (through turbine-loader)
 * to inject Turbine core modules into extension modules being tested. This is not intended to be
 * used within the engine.
 */
module.exports = require('../createPublicRequire')({
  buildInfo: {},
  propertySettings: {},
  getExtensionConfigurations: function() { return []; },
  getSharedModuleExports: function() { },
  getHostedLibFileUrl: function() { return ''; }
});
