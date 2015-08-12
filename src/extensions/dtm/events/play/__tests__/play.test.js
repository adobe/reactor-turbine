'use strict';

describe('play event type', function() {
  var testStandardEvent = require('../../__tests__/helpers/testStandardEvent');
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../play');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly')
  });

  testStandardEvent(delegate, 'play');
});
