'use strict';

/**
 * Provides a require() function which extensions can use during testing. This will return
 * Turbine core modules similar to how it would if the extension module called require() while
 * actually running within Turbine.
 *
 * @type {Function}
 */
module.exports = require('../src/createPublicRequire')();
