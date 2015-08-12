'use strict';

describe('pause event type', function() {
  var testStandardEvent = require('../../__tests__/helpers/testStandardEvent');
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../pause');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly')
  });

  testStandardEvent(delegate, 'pause');
});
