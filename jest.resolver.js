module.exports = (request, options) => {
  // Jest resolver to handle .js extensions in TypeScript imports
  if (request.endsWith('.js')) {
    const tsRequest = request.replace(/\.js$/, '.ts');
    try {
      return options.defaultResolver(tsRequest, options);
    } catch (e) {
      // If .ts file doesn't exist, try the original .js request
      return options.defaultResolver(request, options);
    }
  }
  
  return options.defaultResolver(request, options);
};