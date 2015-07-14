var getElementText = require('../getElementText');
var testElement;

describe('getElementText', function() {
  it('returns the correct textContent for an element', function() {
    testElement = document.createElement('p');
    testElement.id = 'test';
    testElement.textContent = 'This is my content';
    document.body.appendChild(testElement);

    expect(getElementText(testElement)).toEqual('This is my content');
  });

  it('returns the correct innerText for an element', function() {
    testElement = document.createElement('p');
    testElement.id = 'test';
    testElement.innerText = 'This is my inner content';
    document.body.appendChild(testElement);

    expect(getElementText(testElement)).toEqual('This is my inner content');
  });

  it('returns the correct textContent & innerText for an element', function() {
    // not sure which should get returned actually.
    testElement = document.createElement('p');
    testElement.id = 'test';
    testElement.textContent = 'This is my content';
    testElement.innerText = 'This is my inner content';
    document.body.appendChild(testElement);

    expect(getElementText(testElement)).toEqual('This is my inner content');
  });

  it('returns an empty string if neither is set', function() {
    // not sure which should get returned actually.
    testElement = document.createElement('p');
    testElement.id = 'test';
    document.body.appendChild(testElement);

    expect(getElementText(testElement)).toBe('');
  });
});
