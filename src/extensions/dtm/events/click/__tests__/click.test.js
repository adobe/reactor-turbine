'use strict';

describe('click event type', function() {
  var standardEventHelper = require('../../__tests__/helpers/standardEventHelper');
  var publicRequire = require('../../../../../engine/publicRequire');
  var delegateInjector = require('inject!../click');
  var delegate = delegateInjector({
    createBubbly: publicRequire('createBubbly'),
    liveQuerySelector: publicRequire('liveQuerySelector'),
    createDataStash: publicRequire('createDataStash')
  });

  var helper = standardEventHelper(delegate, 'click');
  helper.testListenerAddedToElement();
  helper.testListenerAddedToDocument();
});
