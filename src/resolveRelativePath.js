/**
 * @private
 * Returns the directory of a path. A limited version of path.dirname in nodejs.
 *
 * To keep it simple, it makes the following assumptions:
 * path has a least one slash
 * path does not end with a slash
 * path does not have empty segments (e.g., /src/lib//foo.bar)
 *
 * @param {string} path
 * @returns {string}
 */
var dirname = function(path) {
  return path.substr(0, path.lastIndexOf('/'));
};

/**
 * Given a starting path and a path relative to the starting path, returns the final path. A
 * limited version of path.resolve in nodejs.
 *
 * To keep it simple, it makes the following assumptions:
 * fromPath has at least one slash
 * fromPath does not end with a slash.
 * fromPath does not have empty segments (e.g., /src/lib//foo.bar)
 * relativePath starts with ./ or ../
 *
 * @param {string} fromPath
 * @param {string} relativePath
 * @returns {string}
 */
module.exports = function(fromPath, relativePath) {
  var relativePathSegments = relativePath.split('/');
  var resolvedPathSegments = dirname(fromPath).split('/');

  relativePathSegments.forEach(function(relativePathSegment) {
    if (!relativePathSegment || relativePathSegment === '.') {
      return;
    } else if (relativePathSegment === '..') {
      if (resolvedPathSegments.length) {
        resolvedPathSegments.pop();
      }
    } else {
      resolvedPathSegments.push(relativePathSegment);
    }
  });

  return resolvedPathSegments.join('/');
};
