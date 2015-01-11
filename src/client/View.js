'use strict';

var $ = require('jquery')
  , _ = require('lodash');

function View(selector, node, opts) {
  this.selector = node;
  this.parent = null;
  this.children = [];
  this.render = opts.render;
  this.args = opts.args;
  this.viewState = {
    args: null,
    result: null
  };
}

/**
 * @param {object} ctx
 * @param {*...}
 * @returns {string}
 */
View.prototype.render = function(html) {
  $(this.selector).html(html);
};

/**
 * @param {*[]} args
 * @returns {boolean}
 */
View.prototype.dirty = function(args) {
  return !_.isEqual(args !== this.viewState.args);
};

/**
 * @param {object} ctx
 * @param {function} next
 * @returns {null}
 */
View.prototype.update = function(ctx, next){
  var args = this.args(ctx);
  if (this.dirty(args)) {
    his.render.apply([ctx].concat(args)));
    this.viewState.args = args;
  }
  next();
  return this.viewState.result;
};


module.exports = View;
