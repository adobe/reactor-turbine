var textCleaner = require('../cleanText');

describe('cleanText', function() {
  it('removes extra spaces from a string', function() {
    expect(textCleaner('Clean   multiple    spaces')).toEqual('Clean multiple spaces');
  });

  it('removes new lines from a string', function() {
    expect(textCleaner('new line here \n and here \n')).toEqual('new line here and here');
  });

  it('removes Same sting if no modifications need to be made', function() {
    expect(textCleaner('This is my Perfect String')).toEqual('This is my Perfect String');
  });

  it('removes extra spaces from the end of a string', function() {
    expect(textCleaner('This is my String     ')).toEqual('This is my String');
  });
});
