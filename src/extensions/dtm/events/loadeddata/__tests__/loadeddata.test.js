'use strict';

describe('loadeddata event type', function() {
  var testStandardEvent = require('../../__tests__/helpers/testStandardEvent');
  var publicRequire = require('../../../__tests__/helpers/stubPublicRequire')();
  var delegateInjector = require('inject!../loadeddata');
  var delegate = delegateInjector({
    resources: publicRequire('resources')
  });

  testStandardEvent(delegate, 'loadeddata');
});
