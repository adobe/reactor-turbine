'use strict';

describe('ended event type', function() {
  var options = {
    nativeEventType: 'ended',
    extensionEventType: 'dtm.ended'
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
