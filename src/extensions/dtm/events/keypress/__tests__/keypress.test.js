'use strict';

describe('keypress event type', function() {
  var testStandardEvent = require('../../__tests__/helpers/testStandardEvent');
  var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../keypress');
  var delegate = delegateInjector({
    'dtm/createBubbly': publicRequire('dtm/createBubbly')
  });

  testStandardEvent(delegate, 'keypress');
});
