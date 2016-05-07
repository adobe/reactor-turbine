module.exports = function(fromPath, relativePath) {
  var relativePathSegments = relativePath.split('/');
  var resolvedPathSegments = fromPath.split('/');

  // Assumes fromPath has a filename that needs to be removed.
  resolvedPathSegments.pop();

  relativePathSegments.forEach(function(relativePathSegment) {
    if (relativePathSegment === '.') {
      return;
    } else if (relativePathSegment === '..') {
      resolvedPathSegments.pop();
    } else {
      resolvedPathSegments.push(relativePathSegment);
    }
  });

  var resolvedPath = resolvedPathSegments.join('/');

  return resolvedPath;
};
