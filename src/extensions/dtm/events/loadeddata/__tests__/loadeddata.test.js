'use strict';

describe('loadeddata event type', function() {
  var standardEventHelper = require('../../__tests__/helpers/standardEventHelper');
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../loadeddata');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly')
  });

  var helper = standardEventHelper(delegate, 'loadeddata');
  helper.testListenerAddedToDocument();
});
