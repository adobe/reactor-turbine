'use strict';

describe('entersViewport Event Tests', function() {
  runTestPage('noDelayNestedElements.html');
  runTestPage('preAddElementInView.html');
  runTestPage('preAddElementScrollingWithDelays.html');
  runTestPage('postAddElementInView.html');
  runTestPage('postAddElementScrolling.html');
  runTestPage('sameDelaySameElement.html');
  runTestPage('noDelaySameElement.html');
  runTestPage('differentDelaySameElement.html');
  runTestPage('sameDelayNestedElements.html');
  runTestPage('differentDelayNestedElements.html');
});
