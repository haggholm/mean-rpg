'use strict';

var _ = require('lodash')
  , tree = require('./tree')
  , isLeaf = tree.isLeaf
  , isRoot = tree.isRoot;


function getId(node) {
  return node.object._id;
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
  // Inverse of Σ[n=1..value](n)  ->  ½ * [ √(8n+1) - 1 ]
  return Math.floor(
    (Math.sqrt(8.0 * points + 1.0) - 1.0) / 2.0
  );
}

function valueToPoints(value) {
  if (value < 0) {
    return -valueToPoints(-value);
  }
  // Σ[n=1..value](n)
  return (value * (value+1)) / 2;
}

var EXP_SHARE_FACTOR = 3
  , EXP_PARENT_FACTOR = 1.0 / EXP_SHARE_FACTOR
  , EXP_CHILD_FACTOR = 1 - EXP_PARENT_FACTOR;


module.exports = {
  pointsToValue: pointsToValue,
  valueToPoints: valueToPoints,


  /**
   * @param {TreeNode[]} nodes
   */
  recalculateValues: function(nodes) {
    var getAccumulatedPoints = _.memoize(function(node) {
      node.accumulatedPoints = (node.object.points +
             sum(_.map(node.children, getAccumulatedPoints)));
      return node.accumulatedPoints;
    }, getId);

    var getEffectivePoints = _.memoize(function(node) {
      // @TODO: This is probably wrong.
      if (isLeaf(node.parent)) {
        var parentPoints = getAccumulatedPoints(node.parent) * EXP_PARENT_FACTOR
          , childPoints = node.object.points * EXP_CHILD_FACTOR;
        node.effectivePoints = childPoints + parentPoints;
      } else {
        node.effectivePoints = node.object.points;
      }
      return node.effectivePoints;
    }, getId);

    _.map(nodes, function(node){
      node.value = isLeaf(node) ?
        pointsToValue(getEffectivePoints(node)) :
        pointsToValue(node.accumulatedPoints / EXP_SHARE_FACTOR);
    });
  }
};
