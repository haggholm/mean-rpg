module.exports = {
  angular: {
    exports: 'angular',
    depends: {jquery: 'jQuery'}
  },
  'angular-nvd3': {
    exports: null,
    depends: {
      angular: 'angular',
      nvd3: 'nv',
      'd3-browserify': 'd3'
    }
  },
  'angular-resource': {
    exports: null,
    depends: {angular: 'angular'}
  },
  bootstrap: {
    depends: {jquery: 'jQuery'},
    exports: null
  },
  mathjax: {
    exports: 'MathJax'
  },
  nvd3: {
    exports: 'nv',
    depends: {'d3-browserify': 'd3'}
  }
};
