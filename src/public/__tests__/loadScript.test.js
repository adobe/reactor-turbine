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

var loadScript = require('../loadScript');

describe('loadScript', function() {
  it('returns a promise', function() {
    var promise = loadScript('https://code.jquery.com/jquery-2.2.1.min.js');
    expect(promise.then).toBeDefined();
    expect(promise.catch).toBeDefined();
  });

  it('the promise should be fulfilled when the script is loaded', function(callback) {
    loadScript('https://code.jquery.com/jquery-2.2.1.min.js').
    then(callback);
  });

  it('the promise should be rejected when the script fails loading', function(callback) {
    loadScript('https://someinexistentdomain/somefile.min.js').
    catch(callback);
  });
});
