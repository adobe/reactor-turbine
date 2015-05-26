window.testPage = function(filename, only) {
  function eraseLocalStorageSettings() {
    if (!window.localStorage) {
      return;
    }

    localStorage.removeItem('sdsat_debug');
    localStorage.removeItem('sdsat_hide_activity');
  }

  function loadIframe(url) {
    var iframe = document.createElement('iframe');
    iframe.style.width = '600px';
    iframe.style.height = '400px';
    iframe.style.border = '1px solid #888';
    iframe.src = url;
    document.body.appendChild(iframe);
    return iframe;
  }

  function runTest(done) {
    eraseLocalStorageSettings();

    var iframe = loadIframe('/base/' + filename);
    var iwin = iframe.contentWindow || iframe.contentDocument.defaultView;

    iwin.done = function() {
      //document.body.removeChild(iframe);
      done();
    };
    iwin.expect = expect;
    iwin.fail = fail;
    iwin.jasmine = jasmine;
  }

  describe('test page', function() {
    var testName = 'validates ' + filename;
    if (only) {
      it.only(testName, runTest);
    } else {
      it(testName, runTest);
    }
  });
};
