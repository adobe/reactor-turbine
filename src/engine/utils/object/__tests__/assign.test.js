var assign = require('../assign');

var target = {a: 'apple', b: 'banana', c: 'cucumber'};

describe('assigns', function() {
  it('returns new property list for own properties', function() {

    function Apple() {
      this.color = 'green';
    }

    Apple.prototype = {a: 'honeycrisp'};

    var apple = new Apple();
    var res = assign(target, apple);

    expect(res.color).toEqual('green');
    expect(res.a).toEqual('apple');
  });

  it('returns a new property list with all values', function() {
    var res = assign(target, {e: 'eclair'});
    expect(res).toBe(target);
  });

  it('value of last property overrides previous.', function() {
    var res = assign(target, {a: 'apricot'});
    expect(res.a).toEqual('apricot');
  });

});
