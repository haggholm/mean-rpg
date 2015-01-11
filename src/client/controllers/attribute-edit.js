'use strict';

var _ = require('lodash')
  , templates = require('templates')
  , tree = require('../../lib/calculation/tree')
  , TreeNode = tree.TreeNode
  , View = require('../View');
require('../services/models');

module.exports = new View({
  selector: '#main',
  render: function(ctx, next) {
    loadAttributes(function(attrs){
      var attributeNodes = tree.makeTree(attrs)
        , rootAttributeNodes = tree.roots(attributeNodes);
      this.render(templates['attribute-edit']({
        attributeNodes: attributeNodes,
        rootAttributeNodes: rootAttributeNodes
      }));
      next();
    });
  }
});


    updateAttributes(function() {
      if ($stateParams.id) {
        $scope.activeAttributeNode = $scope.attributeNodes[$stateParams.id];
      } else {
        $scope.activeAttributeNode = new TreeNode(new ModelService.Attribute());
      }
    });

    $scope.;
  }
);
