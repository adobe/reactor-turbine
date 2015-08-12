'use strict';

describe('keypress event type', function() {
  var testStandardEvent = require('../../__tests__/helpers/testStandardEvent');
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../keypress');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly')
  });

  testStandardEvent(delegate, 'keypress');
});
