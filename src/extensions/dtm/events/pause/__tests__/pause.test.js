'use strict';

describe('pause event type', function() {
  var standardEventHelper = require('../../__tests__/helpers/standardEventHelper');
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../pause');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly')
  });

  var helper = standardEventHelper(delegate, 'pause');
  helper.testListenerAddedToDocument();
});
