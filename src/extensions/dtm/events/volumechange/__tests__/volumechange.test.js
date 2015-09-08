'use strict';

describe('volumechange event type', function() {
  var testStandardEvent = require('../../__tests__/helpers/testStandardEvent');
  var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../volumechange');
  var delegate = delegateInjector({
    'dtm/createBubbly': publicRequire('dtm/createBubbly')
  });

  testStandardEvent(delegate, 'volumechange');
});
