'use strict';

var encodeObjectToURI = require('../encodeObjectToURI');
var uriObj = {};

describe('encodeObjectToURI', function() {

  beforeEach(function() {
    uriObj = {dryFly1: 'elkHairCaddis'};
  });

  it('returns an empty string if non object is passed', function() {
    expect(encodeObjectToURI('string')).toEqual('');
    expect(encodeObjectToURI('string')).not.toBe(null);
  });

  it('returns correct encoded string for a single key/value pair', function() {
    var sourceObj = encodeObjectToURI(uriObj);
    expect(sourceObj).toEqual('dryFly1=elkHairCaddis');
    expect(typeof sourceObj).toBe('string');
  });

  it('returns correct encoded string for a multiple key/value pairs', function() {
    uriObj.dryFly2 = 'PMD';
    uriObj.dryFly3 = 'BWO';
    expect(encodeObjectToURI(uriObj)).toEqual('dryFly1=elkHairCaddis&dryFly2=PMD&dryFly3=BWO');
    expect(encodeObjectToURI(uriObj)).toMatch(/\&/);
  });
});
