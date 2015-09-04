'use strict';

describe('ended event type', function() {
  var testStandardEvent = require('../../__tests__/helpers/testStandardEvent');
  var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../ended');
  var delegate = delegateInjector({
    'dtm/createBubbly': publicRequire('dtm/createBubbly')
  });

  testStandardEvent(delegate, 'ended');
});
