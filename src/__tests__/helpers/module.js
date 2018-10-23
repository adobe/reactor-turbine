module.exports = {
  extensionName: 'test-extension',
  toCamelCase: function(str) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
        return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
      })
      .replace(/\s+/g, '');
  },
  toSnakeCase: function toSnakeCase(str) {
    if (!str) return '';

    return String(str)
      .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
      .replace(/([a-z])([A-Z])/g, function(m, a, b) {
        return a + '-' + b.toLowerCase();
      })
      .replace(/[^A-Za-z0-9]+|_-+/g, '-')
      .toLowerCase();
  },

  createModule: function(name, scriptFn) {
    var cName = this.toCamelCase(name);
    var sName = this.toSnakeCase(name);

    return [
      this.getPath(cName),
      {
        name: sName,
        displayName: name,
        script: scriptFn
      },
      this.extensionName
    ];
  },

  getPath: function(name) {
    return this.extensionName + '/' + this.toCamelCase(name) + '.js';
  },

  getType: function(name) {
    return this.extensionName + '.' + this.toSnakeCase(name);
  }
};
