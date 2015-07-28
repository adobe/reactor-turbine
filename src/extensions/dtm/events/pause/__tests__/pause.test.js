'use strict';

describe('pause event type', function() {
  var options = {
    nativeEventType: 'pause',
    extensionEventType: 'dtm.pause'
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
