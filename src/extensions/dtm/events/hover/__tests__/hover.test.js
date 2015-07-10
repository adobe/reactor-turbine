'use strict';

describe('hover event type', function() {
  runTestPage(
    'triggers multiple rules with the no delay targeting nested elements',
    'noDelayNestedElements.html');
  runTestPage(
    'triggers multiple rules with no delay targeting the same element',
    'noDelaySameElement.html');
  runTestPage(
    'triggers multiple rules with the same delay targeting nested elements',
    'sameDelayNestedElements.html');
  runTestPage(
    'triggers multiple rules with different delays targeting nested elements',
    'differentDelayNestedElements.html');
  runTestPage(
    'triggers multiple rules with the same delay targeting the same element',
    'sameDelaySameElement.html');
  runTestPage(
    'triggers multiple rules with different delays targeting the same element',
    'differentDelaySameElement.html');
});
