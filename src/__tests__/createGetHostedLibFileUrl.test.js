'use strict';

describe('function returned by createGetHostedLibFileUrl', function() {
  var createGetHostedLibFileUrl = require('../createGetHostedLibFileUrl');

  it('returns full hosted lib path url', function() {
    var getHostedLibFileUrl = createGetHostedLibFileUrl('//example.com/');
    expect(getHostedLibFileUrl('file.js')).toEqual('//example.com/file.js');
  });
});
