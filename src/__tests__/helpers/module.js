var camelCase = require('camelize');
var kebabCase = require('kebab-case');

module.exports = {
  extensionName: 'test-extension',
  createModule: function (name, scriptFn) {
    var cName = camelCase(name);
    var kName = kebabCase(name);

    return [
      this.getPath(cName),
      {
        name: kName,
        displayName: name,
        script: scriptFn
      },
      this.extensionName
    ];
  },

  getPath: function (name) {
    return this.extensionName + '/' + camelCase(name) + '.js';
  }
};
