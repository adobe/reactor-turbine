'use strict';

describe('entersViewport event type', function() {
  runTestPage(
    'triggers multiple rules with no delay targeting nested elements',
    'noDelayNestedElements.html');
  runTestPage(
    'triggers rule when element previously added is already in view',
    'preAddElementInView.html');
  runTestPage(
    'triggers rule when element previously added is scrolled into view and a delay is set',
    'preAddElementScrollingWithDelays.html');
  runTestPage(
    'triggers rule when element is added later and is already in view',
    'postAddElementInView.html');
  runTestPage(
    'triggers rule when element is added later and is scrolled into view',
    'postAddElementScrolling.html');
  runTestPage(
    'triggers multiple rules with the same delay targeting the same element',
    'sameDelaySameElement.html');
  runTestPage(
    'triggers multiple rules with no delay targeting the same element',
    'noDelaySameElement.html');
  runTestPage(
    'triggers multiple rules with different delays targeting the same element',
    'differentDelaySameElement.html');
  runTestPage(
    'triggers multiple rules with the same delay targeting nested elements',
    'sameDelayNestedElements.html');
  runTestPage(
    'triggers multiple rules with different delays targeting nested elements',
    'differentDelayNestedElements.html');
});
