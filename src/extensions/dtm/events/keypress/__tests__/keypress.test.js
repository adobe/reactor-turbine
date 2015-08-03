'use strict';

describe('keypress event type', function() {
  var options = {
    nativeEventType: 'keypress',
    extensionEventType: 'dtm.keypress'
  };

  runTestPage(
    'triggers rule when element already added and listener added to document',
    '../../__tests__/helpers/preAddElementWithHandlerOnDocument.html',
    options);
  runTestPage(
    'triggers rule when element added later with listener added to document',
    '../../__tests__/helpers/postAddElementWithHandlerOnDocument.html',
    options);
});
