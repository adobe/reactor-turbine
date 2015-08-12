'use strict';

describe('loadeddata event type', function() {
  var testStandardEvent = require('../../__tests__/helpers/testStandardEvent');
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../loadeddata');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly')
  });

  testStandardEvent(delegate, 'loadeddata');
});
