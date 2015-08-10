'use strict';

describe('focus event type', function() {
  var standardEventHelper = require('../../__tests__/helpers/standardEventHelper');
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../focus');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly')
  });

  var helper = standardEventHelper(delegate, 'focus');
  helper.testListenerAddedToDocument();
});
