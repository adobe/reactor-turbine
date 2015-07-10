'use strict';

describe('hideActivity local storage setting', function() {
  runTestPage('does not execute action when set to true', 'sdsatHideActivityTrue.html');
  runTestPage('does execute action when not set', 'sdsatHideActivityFalse.html');
});
