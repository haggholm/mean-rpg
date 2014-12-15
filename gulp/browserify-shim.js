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
  'angularjs-nvd3-directives': {
    exports: null,
    depends: {
      angular: 'angular',
      nvd3: 'nv',
      'd3-browserify': 'd3'
    }
  },
  bootstrap: {
    depends: {jquery: 'jQuery'},
    exports: null
  },
  nvd3: {
    exports: 'nv',
    depends: {
      'd3-browserify': 'd3'
    }
  }
};
