describe('once', function() {
  var once;

  beforeAll(function() {
    once = require('../once');
  });

  it('calls the target function at most a single time', function() {
    var targetFn = jasmine.createSpy();
    var oncified = once(targetFn);

    oncified();

    expect(targetFn.calls.count()).toBe(1);

    oncified();

    expect(targetFn.calls.count()).toBe(1);
  });

  it('calls the target function with the provided context', function() {
    var targetFn = jasmine.createSpy();
    var context = {};
    var oncified = once(targetFn, context);

    oncified();

    expect(targetFn.calls.first().object).toBe(context);
  });

  it('calls the target function with the provided arguments', function() {
    var targetFn = jasmine.createSpy();
    var oncified = once(targetFn);

    oncified('a', 'b');

    expect(targetFn.calls.first().args).toEqual(['a', 'b']);
  });
});
