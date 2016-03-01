describe('debounce', function() {
  var debounce;

  beforeAll(function() {
    debounce = require('../debounce');
    jasmine.clock().install();
  });

  afterAll(function() {
    jasmine.clock().uninstall();
  });

  it('calls the target function once after delay', function() {
    var targetFn = jasmine.createSpy();
    var debouncedFn = debounce(targetFn, 100);

    debouncedFn();

    expect(targetFn.calls.count()).toBe(0);

    jasmine.clock().tick(60);

    debouncedFn();

    jasmine.clock().tick(60);

    expect(targetFn.calls.count()).toBe(0);

    jasmine.clock().tick(40);

    expect(targetFn.calls.count()).toBe(1);
  });

  it('calls the target function using the provided context', function() {
    var targetFn = jasmine.createSpy();
    var context = {};

    debounce(targetFn, 100, context)();

    jasmine.clock().tick(100);

    expect(targetFn.calls.first().object).toBe(context);
  });

  it('calls the target function using the provided arguments', function() {
    var targetFn = jasmine.createSpy();

    debounce(targetFn, 100)('arg1', 'arg2');

    jasmine.clock().tick(100);

    expect(targetFn.calls.first().args).toEqual(['arg1', 'arg2']);
  });
});
