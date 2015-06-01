(function() {
  // We have to deliver a new instance of the jasmine clock because jasmine.clock is already tied
  // to this window's globals an not the iframe's window's globals. For this we create
  // a special jasmine instance that overrides the clock method but inherits the rest of the
  // this window's jasmine object.
  var IFrameJasmine = function(iwin) {
    var _clock = new jasmine.Clock(
      iwin,
      function () { return new jasmine.DelayedFunctionScheduler(); },
      new jasmine.MockDate(iwin));
    this.clock = function() {
      return _clock;
    };
  };

  IFrameJasmine.prototype = jasmine;

  window.testPage = function(filename, focus) {
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
        document.body.removeChild(iframe);
        done();
      };
      iwin.expect = expect;
      iwin.fail = fail;
      iwin.jasmine = new IFrameJasmine(iwin);
    }

    describe('test page', function() {
      var testName = 'validates ' + filename;
      if (focus) {
        fit(testName, runTest);
      } else {
        it(testName, runTest);
      }
    });
  };

  window.ftestPage = function(filename) {
    window.testPage(filename, true);
  };
})();
