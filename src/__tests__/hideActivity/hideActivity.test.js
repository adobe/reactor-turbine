'use strict';

describe('hideActivity local storage setting', function() {
  runTestPage('does not execute action when set to true',
    __dirname + '/sdsatHideActivityTrue.html');
  runTestPage('does execute action when not set', __dirname + '/sdsatHideActivityFalse.html');
});
