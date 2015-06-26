var assign = require('../assign');

var target = {a:'apple', b:'banana', c:'cucumber'};
var target2 = {d:'dandilion', a:'apricot'};

describe('assigns', function() {
  it('returns new property list for own properties', function() {

    function Fruit() {
      this.color = 'red';
    };

    var fruity = new Fruit();
    var moreFruity = new Fruit();

    Fruit.prototype = target;

    var res = assign(fruity, target);

    expect(res).toEqual(fruity);
    expect(moreFruity).not.toEqual(fruity);
  });

  it('returns a new property list replacing key with new value', function() {
    var res = assign(target, target2, {e:'eclair'});

    expect(res).toEqual(target);
  });

});
