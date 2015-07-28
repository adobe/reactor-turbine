'use strict';

describe('blur event type', function() {
  var options = {
    nativeEventType: 'blur',
    extensionEventType: 'dtm.blur'
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
