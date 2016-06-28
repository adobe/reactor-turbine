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
    }).toThrowError('Cannot call `document.write` after `DOMContentloaded` has fired.')
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
