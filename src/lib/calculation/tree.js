'use strict';

var _ = require('lodash');


/**
 * @param {object} object
 * @param {object} opts
 * @param {TreeNode} opts.parent
 * @param {TreeNode[]} opts.children
 *
 * @property {object} object
 * @property {TreeNode} parent
 * @property {TreeNode[]} children
 * @class
 */
function TreeNode(object, opts) {
  if (object === null || object === undefined) {
    throw 'TreeNode value object must be defined';
  }
  this.object = object;
  this.children = (opts && opts.children) || [];
  this.parent = (opts && opts.parent) || null;
}


module.exports = {
  /**
   * @param {TreeNode} node
   * @returns {boolean}
   */
  isLeaf: function isLeaf(node) {
    return node.children === undefined ||
           node.children === null ||
           node.children.length === 0;
  },

  /**
   * @param {TreeNode} node
   * @returns {boolean}
   */
  isRoot: function isRoot(node) {
    return node.parent === undefined || node.parent === null;
  },

  TreeNode: TreeNode,

  /**
   * @param {object[]} objects Objectswith _id property
   * @return {TreeNode[]} TreeNodes containing objects, with fully initialised
   *                  tree structure
   * @function
   */
  makeTree: function makeTree(objects) {
    var nodesById = {};
    _.forEach(objects, function(ob) {
      nodesById[ob._id] = new TreeNode(ob);
    });

    _.forEach(nodesById, function(node) {
      var parentId = node.object.parent;
      node.parent = nodesById[parentId];
      if (parentId !== undefined && parentId !== null && !node.parent) {
        throw 'Parent ' + parentId + 'of ' + node.object._id +
              ' not found in tree!';
      } else if (node.parent) {
        node.parent.children.push(node);
      }
    });

    var setDepth = function(node, depth) {
      node.depth = depth;
      _.forEach(node.children, function(ch) {
        setDepth(ch, depth + 1);
      });
    };
    _.forEach(_.filter(nodesById, exports.isRoot), function(root) {
      setDepth(root, 0);
    });

    return nodesById;
  },

  /**
   * @param {TreeNode[]} trees
   */
  leaves: function leaves(trees) {
    return _.filter(trees, exports.isLeaf);
  },

  /**
   * @param {TreeNode[]} trees
   */
  roots: function leaves(trees) {
    return _.filter(trees, exports.isRoot);
  }
};
