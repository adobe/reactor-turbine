'use strict';

var conditionDelegateInjector = require('inject!../hash');
var publicRequire = require('../../../../../engine/publicRequire');
var conditionDelegate = conditionDelegateInjector({
  textMatch: publicRequire('textMatch')
});

describe('hash condition delegate', function() {

  beforeAll(function() {
    document.location.hash = 'hashtest';
  });

  afterAll(function() {
    document.location.hash = '';
  });

  describe('include', function() {
    it('returns true when the hash matches one of the string options', function() {
      var config = {
        conditionConfig: {
          include: ['#foo', '#hashtest']
        }
      };

      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the hash does not match one of the string options', function() {
      var config = {
        conditionConfig: {
          include: ['#foo', '#goo']
        }
      };

      expect(conditionDelegate(config)).toBe(false);
    });

    it('returns true when the hash matches one of the regex options', function() {
      var config = {
        conditionConfig: {
          include: ['#foo', /has.test/i]
        }
      };

      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the hash does not match one of the regex options', function() {
      var config = {
        conditionConfig: {
          include: ['#foo', /#g.o/i]
        }
      };

      expect(conditionDelegate(config)).toBe(false);
    });
  });

  describe('exclude', function() {
    it('returns true when the hash does not match one of the string options', function() {
      var config = {
        conditionConfig: {
          exclude: ['#foo', '#goo']
        }
      };

      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the hash matches one of the string options', function() {
      var config = {
        conditionConfig: {
          exclude: ['#foo', '#hashtest']
        }
      };

      expect(conditionDelegate(config)).toBe(false);
    });

    it('returns true when the hash does not match one of the regex options', function() {
      var config = {
        conditionConfig: {
          exclude: ['#foo', /#g.o/i]
        }
      };

      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the hash matches one of the regex options', function() {
      var config = {
        conditionConfig: {
          exclude: ['#foo', '#hashtest']
        }
      };

      expect(conditionDelegate(config)).toBe(false);
    });
  });

  describe('mixed', function() {
    it('returns true when the hash matches an include option and does not match ' +
        'an exclude option', function() {
      var config = {
        conditionConfig: {
          include: ['#foo', '#hashtest'],
          exclude: ['#goo']
        }
      };

      expect(conditionDelegate(config)).toBe(true);
    });

    it('returns false when the hash does not match an include option and does not match ' +
        'an exclude option', function() {
      var config = {
        conditionConfig: {
          include: ['#foo', '#goo'],
          exclude: ['#shoo']
        }
      };

      expect(conditionDelegate(config)).toBe(false);
    });

    it('returns false when the hash matches an include option and matches ' +
        'an exclude option', function() {
      var config = {
        conditionConfig: {
          include: ['#foo', '#hashtest'],
          exclude: ['#hashtest']
        }
      };

      expect(conditionDelegate(config)).toBe(false);
    });
  });
});
