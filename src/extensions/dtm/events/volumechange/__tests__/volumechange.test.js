'use strict';

describe('volumechange event type', function() {
  var standardEventHelper = require('../../__tests__/helpers/standardEventHelper');
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../volumechange');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly')
  });

  var helper = standardEventHelper(delegate, 'volumechange');
  helper.testListenerAddedToDocument();
});
