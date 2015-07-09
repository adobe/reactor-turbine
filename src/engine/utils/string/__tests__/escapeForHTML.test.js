var escaper = require('../escapeForHTML');

describe('escapeForHTML', function() {
  it('replaces \& with \'&amp;\'', function() {
    expect(escaper('replace & with amp;')).toEqual('replace &amp; with amp;');
  });

  it('replaces \< with \'&lt;\'', function() {
    expect(escaper('replace < with lt;')).toEqual('replace &lt; with lt;');
  });

  it('replaces \> with \'&gt;\'', function() {
    expect(escaper('replace > with gt;')).toEqual('replace &gt; with gt;');
  });

  it('replaces \" with \'&quot;\'', function() {
    expect(escaper('replace " with quot;')).toEqual('replace &quot; with quot;');
  });

  it('replaces \' with \'&#x27;\'', function() {
    expect(escaper('replace \' with #x27;')).toEqual('replace &#x27; with #x27;');
  });

  it('replaces \/ with \'&#x2F;\'', function() {
    expect(escaper('replace / with #x2F;')).toEqual('replace &#x2F; with #x2F;');
  });

  it('returns the correct string for an html element', function() {
    var el = document.createElement('html');
    el.innerHTML = '<html><head><title>Test</title></head></html>';
    var output = '&lt;head&gt;&lt;title&gt;Test&lt;&#x2F;title' +
      '&gt;&lt;&#x2F;head&gt;&lt;body&gt;&lt;&#x2F;body&gt;';
    expect(escaper(el.innerHTML)).toEqual(output);
  });
});
