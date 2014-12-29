'use strict';

var _ = require('lodash');


function getId(node) {
  return node._id;
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

function pointsToValue(points) {
  if (points < 0) {
    return -pointsToValue(-points);
  }
  //return Math.floor(Math.sqrt(5.0 * points));
  return Math.floor(
    (Math.sqrt(8.0 * points + 1.0) - 1.0) / 2.0
  );
}

function valueToPoints(value) {
  if (value < 0) {
    return -valueToPoints(-value);
  }
  return (value * (value+1)) / 2;
}

function ensureParent(parent, child) {
  if (parent.children === undefined || parent.children === null) {
    parent.children = [child];
  } else if (parent.children.indexOf(child) === -1) {
    parent.children.push(child);
  }
}

function getParentId(node) {
  if (typeof(node.parent) === 'object') {
    ensureParent(node.parent, node);
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
      ensureParent(parent, node);
    }
  });
  return nodes;
}

var EXP_SHARE_FACTOR = 3;

module.exports = {
  pointsToValue: pointsToValue,
  valueToPoints: valueToPoints,

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
        node.effectivePoints =
          node.points * (EXP_SHARE_FACTOR-1)/EXP_SHARE_FACTOR +
          getAccumulatedPoints(node.parent) / EXP_SHARE_FACTOR;
      } else {
        node.effectivePoints = node.points;
      }
      return node.effectivePoints;
    }, getId);

    treeify(nodes);
    _.map(nodes, function(node){
      node.value = pointsToValue(getEffectivePoints(node));
    });
  }
};
