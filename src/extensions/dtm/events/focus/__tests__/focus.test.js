'use strict';

describe('focus event type', function() {
  var testStandardEvent = require('../../__tests__/helpers/testStandardEvent');
  var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../focus');
  var delegate = delegateInjector({
    'dtm/createBubbly': publicRequire('dtm/createBubbly')
  });

  testStandardEvent(delegate, 'focus');
});
