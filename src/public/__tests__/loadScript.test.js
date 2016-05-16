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
