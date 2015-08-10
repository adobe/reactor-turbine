'use strict';

describe('blur event type', function() {
  var standardEventHelper = require('../../__tests__/helpers/standardEventHelper');
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../blur');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly')
  });

  var helper = standardEventHelper(delegate, 'blur');
  helper.testListenerAddedToDocument();
});
