/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

describe('function returned by createGetHostedLibFileUrl', function() {
  var createGetHostedLibFileUrl = require('../createGetHostedLibFileUrl');

  it('returns full hosted lib path url', function() {
    var getHostedLibFileUrl = createGetHostedLibFileUrl('//example.com/');
    expect(getHostedLibFileUrl('file.js')).toEqual('//example.com/file.js');
  });
});
