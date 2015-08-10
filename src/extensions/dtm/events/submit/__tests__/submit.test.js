'use strict';

describe('submit event type', function() {
  var standardEventHelper = require('../../__tests__/helpers/standardEventHelper');
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../submit');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly'),
    liveQuerySelector: publicRequire('liveQuerySelector'),
    createDataStash: publicRequire('createDataStash')
  });

  var helper = standardEventHelper(delegate, 'submit');
  helper.testListenerAddedToElement();
  helper.testListenerAddedToDocument();
});
