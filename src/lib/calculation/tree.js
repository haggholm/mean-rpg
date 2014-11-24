'use strict';

var _ = require('lodash');


function getId(node) {
  return node._id;
}

function isLeaf2(node) {
  return node.children === undefined ||
         node.children === null ||
         node.children.length === 0;
}

function isLeaf(node) {
  return node.children === undefined ||
         node.children === null ||
         node.children.length === 0;
}

function add(a, b) {
  return a + b;
}

function sum(values) {
  return _.reduce(values, add, 0);
}

function valueFromPoints(points) {
  return Math.floor(
    (Math.sqrt(8.0 * points + 1.0) - 1.0) / 2.0
  );
}

function getParentId(node) {
  if (typeof(node.parent) === 'object') {
    return node.parent._id;
  } else if (typeof(node.parent) === 'string') {
    return node.parent;
  } else if (node.parentId !== undefined) {
    return node.parentId;
  } else {
    return null;
  }
}

function treeify(nodes) {
  var nodesById = _.indexBy(nodes, '_id');

  // Read tree structure
  _.each(nodes, function(node){
    var parentId = getParentId(node);
    if (parentId) {
      var parent = node.parent = nodesById[parentId];
      console.log(parent.name, 'is parent to', node.name);
      if (parent.children === undefined || parent.children === null) {
        parent.children = [node];
      } else if (parent.children.indexOf(node) === -1) {
        parent.children.push(node);
      }
    }
  });
  return nodes;
}

var N = 5;

module.exports = {
  /**
   * @param {Tree[]} trees
   */
  leaves: function leaves(trees) {
    var i, node, result = [];
    for (i = 0; i < trees.length; i++) {
      node = trees[i];
      if (isLeaf(node)) {
        result.push(node);
      } else {
        result = result.concat(leaves(node.children));
      }
    }
    return result;
  },

  recalculateValues: function(nodes) {
    var getAccumulatedPoints = _.memoize(function(node) {
      node.accumulatedPoints = (node.points +
             sum(_.map(node.children, getAccumulatedPoints)));
      return node.accumulatedPoints;
    }, getId);
    var getEffectivePoints = _.memoize(function(node) {
      if (node.parent !== undefined && node.parent !== null) {
        node.effectivePoints = node.points * (N-1)/N +
                               getAccumulatedPoints(node.parent) / N;
      } else {
        node.effectivePoints = node.points;
      }
      return node.effectivePoints;
    }, getId);

    treeify(nodes);
    _.map(nodes, function(node){
      node.value = valueFromPoints(getEffectivePoints(node));
    });
  }
};