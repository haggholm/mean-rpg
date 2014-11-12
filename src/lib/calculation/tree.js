// jshint node:true
'use strict';

var _ = require('lodash');

function isLeaf(node) {
  return node.children === undefined ||
         node.children === null ||
         node.children.length === 0;
}

function nodePoints(node) {
  if (node.parent === undefined || node.parent === null) {
    return node.points;
  } else {
    return 2/3 * node.points + nodePoints(node.parent);
  }
}

function valueFromPoints(points) {
  return Math.floor(
    (Math.sqrt(8.0 * points + 1.0) - 1.0) / 2.0
  );
}

function buildTree(nodes) {
  var i, node, tree = {};
  for (i = 0; i < nodes.length; i++) {
    node = nodes[i];
    tree[node._id] = node;
  }
  for (i = 0; i < nodes.length; i++) {
    node = nodes[i];
    if (node.parentId !== undefined && node.parentId !== null) {
      var parent = node.parent = tree[node.parentId];
      if (parent.children === undefined || parent.children === null) {
        parent.children = [node];
      } else {
        parent.children.push(node);
      }
    }
  }
  return tree;
}

module.exports = {
  /**
   * @param {object[]} nodes
   * @returns {{}}
   */
  build: buildTree,

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
    buildTree(nodes);
    var i, node,
      getPoints = _.memoize(nodePoints, function(node) { return node._id; });
    for (i = 0; i < nodes.length; i++) {
      node = nodes[i];
      node.value = valueFromPoints(getPoints(node));
    }
  }
};
