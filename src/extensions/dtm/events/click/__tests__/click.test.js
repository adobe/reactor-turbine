'use strict';

describe('click event type', function() {
  var options = {
    nativeEventType: 'click',
    dtmEventType: 'dtm.click'
  };

  runTestPage(
    'triggers rule when element already added and listener added to document',
    '../../__tests__/helpers/preAddElementWithHandlerOnDocument.html',
    options);
  runTestPage(
    'triggers rule when element already added with listener added to element',
    '../../__tests__/helpers/preAddElementWithHandlerOnElement.html',
    options);
  runTestPage(
    'triggers rule when element added later with listener added to document',
    '../../__tests__/helpers/postAddElementWithHandlerOnDocument.html',
    options);
  runTestPage(
    'triggers rule when element added later with listener added to element',
    '../../__tests__/helpers/postAddElementWithHandlerOnElement.html',
    options);
});
