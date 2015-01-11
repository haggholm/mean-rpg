'use strict';


var TYPES = {
  FUNCTION: 'F',
  ESCAPED: '',
  LITERAL: 'L',
  NUMERAL: 'N'
};

function TemplateModule(html, bindings) {
  return Template.prototype.render.bind(new Template(html, bindings));
}
TemplateModule.createElement = function(nodeName) {
  return document.createElement(nodeName);
};
TemplateModule.TYPE = TYPES;
TemplateModule.DOM_NODE_ID = 'data-tpl-id';

var renderFunctions = {};

TemplateModule.registerHandler = function(code, handler) {
  if (renderFunctions[code] !== undefined) {
    throw 'A handler for template code '+code+' already exists';
  }
  renderFunctions[code] = handler;
};

TemplateModule.getHandler = function(code) {
  return renderFunctions[code];
};



TemplateModule.registerHandler(TYPES.FUNCTION, function(value) {
  return value;
});

TemplateModule.registerHandler(TYPES.ESCAPED, function(value) {
  return TemplateModule.createTextNode(value);
});

TemplateModule.registerHandler(TYPES.LITERAL, function(value) {
  return value;
});

TemplateModule.registerHandler(TYPES.NUMERAL, function(value) {
  return isNaN(value) ? 'NaN' : value;
});


function Template(bindingDefs, html) {
  this.elements = {};
  this.bindings = {};

  var self = this, div = TemplateModule.createElement('div');
  div.innerHTML = html;
  self.root = div;

  var id, defn, el, elements = div.querySelectorAll(Template.idSelector)
    , bindingDefsById = {};
  for (var key in bindingDefs) { // jshint ignore:line
    defn = bindingDefs[key];
    defn.key = key;
    bindingDefsById[defn.id] = defn;
  }
  var i;
  for (i = elements.length-1; i >= 0; i--) {
    el = elements[i];
    id = el.getAttribute(TemplateModule.DOM_NODE_ID);
    if (id in bindingDefsById) {
      defn = bindingDefsById[id];
      self.bindings[defn.binding] = defn;
      defn.node = defn.at ? el.getAttributeNode(defn.at) : el;
      defn.render = renderFunctions[defn.tp];
    }
  }
}
Template.idSelector = '[' + TemplateModule.DOM_NODE_ID + ']';


var CLEAR = Template.CLEAR = {};
Template.prototype.render = function(values) {
  var key, value, defn, res;

  for (key in values) {         // jshint ignore:line
    defn = this.bindings[key];  // jshint ignore:line
    if (defn !== undefined) {
      value = values[key];      // jshint ignore:line
      try {
        res = value === CLEAR ? null : defn.render(value);
      } catch (e) {
        console.error('Failed to render value:', value);
        console.error(e);
        console.trace();
        res = '#ERROR';
      }
      if (defn.at) {
        defn.node.value = res;
      } else {
        defn.node.innerHTML = res;
      }
    }
  }

  return this.root;
};


module.exports = TemplateModule;
