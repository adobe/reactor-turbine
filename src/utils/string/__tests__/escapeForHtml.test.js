var escapeForHtml = require('../escapeForHtml');

describe('escapeForHtml', function() {
  it('replaces \& with \'&amp;\'', function() {
    expect(escapeForHtml('replace & with amp;')).toEqual('replace &amp; with amp;');
  });

  it('replaces \< with \'&lt;\'', function() {
    expect(escapeForHtml('replace < with lt;')).toEqual('replace &lt; with lt;');
  });

  it('replaces \> with \'&gt;\'', function() {
    expect(escapeForHtml('replace > with gt;')).toEqual('replace &gt; with gt;');
  });

  it('replaces \" with \'&quot;\'', function() {
    expect(escapeForHtml('replace " with quot;')).toEqual('replace &quot; with quot;');
  });

  it('replaces \' with \'&#x27;\'', function() {
    expect(escapeForHtml('replace \' with #x27;')).toEqual('replace &#x27; with #x27;');
  });

  it('replaces \/ with \'&#x2F;\'', function() {
    expect(escapeForHtml('replace / with #x2F;')).toEqual('replace &#x2F; with #x2F;');
  });

  it('returns the correct string for an html element', function() {
    var el = document.createElement('div');
    el.innerHTML = 'Some <span class="foo">various</span> <a href="#">text</a>.';
    var output = 'Some &lt;span class=&quot;foo&quot;&gt;various&lt;&#x2F;span&gt; ' +
      '&lt;a href=&quot;#&quot;&gt;text&lt;&#x2F;a&gt;.';
    expect(escapeForHtml(el.innerHTML)).toEqual(output);
  });

  it('returns undefined if no arguments are specified', function() {
    expect(escapeForHtml()).toBeUndefined();
  });
});
