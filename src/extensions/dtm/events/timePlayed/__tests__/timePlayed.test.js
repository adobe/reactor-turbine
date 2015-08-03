'use strict';

describe('timePlayed event type', function() {
  runTestPage(
    'triggers multiple rules with the same amount using second unit targeting the same element',
    'sameAmountSecondUnitSameElement.html'
  );
  runTestPage(
    'triggers multiple rules with the same amount using second unit targeting nested elements',
    'sameAmountSecondUnitNestedElements.html'
  );
  runTestPage(
    'triggers multiple rules with the different amounts using second unit targeting nested ' +
      'elements',
    'differentAmountSecondUnitSameElement.html'
  );
  runTestPage(
    'triggers multiple rules with the different amounts using second unit targeting nested ' +
      'elements',
    'differentAmountSecondUnitNestedElements.html'
  );
  runTestPage(
    'triggers multiple rules with the different amounts using percent unit targeting nested ' +
      'elements',
    'differentAmountPercentUnitNestedElements.html'
  );
  runTestPage(
    'triggers multiple rules with the same amount using different units targeting the same ' +
      'element',
    'sameAmountDifferentUnitSameElement.html'
  );
});
