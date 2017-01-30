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

describe('writeHtml', function() {
  var injectWriteHtml = require('inject!../writeHtml');

  it('should write content in the page before DOMContentLoaded was fired', function() {
    var documentWriteSpy = jasmine.createSpy();
    var writeHtml = injectWriteHtml({
      './hasDomContentLoaded': jasmine.createSpy().and.returnValue(false),
      'document': {
        write: documentWriteSpy
      }
    });

    writeHtml('<span></span>');
    expect(documentWriteSpy).toHaveBeenCalledWith('<span></span>');
  });

  it('should throw an error after DOMContentLoaded was fired', function() {
    var writeHtml = injectWriteHtml({
      './hasDomContentLoaded': jasmine.createSpy().and.returnValue(true)
    });

    expect(function() {
      writeHtml('<span></span>');
    }).toThrowError('Cannot call `document.write` after `DOMContentloaded` has fired.');
  });

  it('should throw an error when `document.write` method is missing', function() {
    var writeHtml = injectWriteHtml({
      'document': {}
    });

    expect(function() {
      writeHtml('<span></span>');
    }).toThrowError('Cannot write HTML to the page. `document.write` is unavailable.');
  });
});
