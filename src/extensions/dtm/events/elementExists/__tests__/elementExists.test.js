'use strict';

describe('elementExists event type', function() {
  runTestPage('triggers multiple rules targeting the same element', 'sameElement.html');
  runTestPage('triggers rules appropriately for nested elements', 'nestedElements.html');
});
