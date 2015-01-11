/**
 * Template-to-DOM framework.
 *
 * {{ escaped html }}
 * {{? conditional }}
 * {{! function (use to bind event handlers) }}
 * {{{ unescaped html }}}
 * {{# numeric }}
 * {{~ iteration }}
 */

'use strict';

var _ = require('lodash')
  , jsdom = require('jsdom').jsdom
  , serializeDocument = require('jsdom').serializeDocument;

var FlakeIdGen = require('flake-idgen')
  , intformat = require('biguint-format')
  , generator = new FlakeIdGen();

var template = require('./Template');


function getRandomId() {
  return 'Tx' + intformat(generator.next(), 'hex');
}

/**
 * @param {Element} element
 */
function getNodeReference(element) {
  if (element.hasAttribute(template.DOM_NODE_ID)) {
    return {id: element.getAttribute(template.DOM_NODE_ID)};
  } else {
    var id = getRandomId();
    element.setAttribute(template.DOM_NODE_ID, id);
    return {id: id};
  }
}


/**
 * @param {Attr} attr
 * @returns {string}
 */
function getAttrReference(attr) {
  return _.extend({attr: attr.name}, getNodeReference(attr.ownerElement));
}


/**
 * @param {Document} doc
 * @constructor
 */
function Processor(doc, opts) {
  this.doc = doc;
  this.opts = opts;
  this.references = {};
}

Processor.prototype.addReference = function(refObj, content, type) {
  if (this.opts.verbose) {
    console.log('Adding new reference '+content+' ['+type+','+refObj+']');
  }
  this.references[content] = {
    tp: type,
    id: refObj.id
  };
  if (refObj.attr) {
    this.references[content].at = refObj.attr;
  }
};

Processor.prototype.processContent = function(refObj, content) {
  switch (content) {
    case '!':
      this.addReference(
        refObj,
        content.substr(1).replace(/^\s+/, ''),
        template.TYPE.FUNCTION
      );
      break;
    case '|':
      this.addReference(
        refObj,
        content.substr(1).replace(/^\s+/, ''),
        template.TYPE.LITERAL
      );
      break;
    default:
      this.addReference(
        refObj,
        content,
        template.TYPE.ESCAPED
      );
      break;
  }
};

var mustacheRegex = /(.*)\{\{\s*([^}]*[^\s}]\s*)\}\}/g;
mustacheRegex.IDX_PREAMBLE = 1;
mustacheRegex.IDX_CONTENT = 2;

/**
 * @param {Attr} attr
 */
Processor.prototype.processAttribute = function(attr) {
  if (this.opts.verbose) {
    console.log('Processing attribute ' + attr.nodeName);
  }
  var val = attr.value;
  if (typeof(val) !== 'string') {
    return;
  }
  var m = mustacheRegex.exec(val);
  mustacheRegex.lastIndex = 0;
  if (m) {
    this.processContent(getAttrReference(attr), m[mustacheRegex.IDX_CONTENT]);
    attr.value = '';
  }
};

/**
 * @param {Element} node
 */
Processor.prototype.processElement = function(node) {
  if (this.opts.verbose) {
    console.log('Processing ' + node.nodeName);
  }

  // Process child nodes. If any of them return substitutions,
  // well, substitute them.
  var child = node.firstChild, newChild;
  while (child) {
    newChild = this.processElement(child);
    if (newChild !== child) {
      node.replaceChild(newChild, child);
    }
    child = child.nextSibling;
  }

  // Process attrs.
  _.forEach(node.attributes, this.processAttribute.bind(this));

  // Process content. This is only relevant for text nodes.
  var returnNode = node;
  if (node.nodeName === '#text') {
    var text = node.nodeValue;
    if (this.opts.verbose) {
      console.log('Analysing text: '+text);
    }

    if (text && text.match(/^(.*)\{\{.*\}\}$/)) {
      // The node is nothing but mustache. Process it.
      returnNode = this.doc.createElement('span');
      this.processContent(
        getNodeReference(returnNode),
        mustacheRegex.exec(text)[mustacheRegex.IDX_CONTENT]
      );
      mustacheRegex.lastIndex = 0;

    } else if (text && mustacheRegex.test(text)) {
      mustacheRegex.lastIndex = 0;

      // The node *contains* mustaches, but is not all mustache.
      // We have to change it to a new node containing references.
      returnNode = node.createElement('span');

      var m;
      while ((m = mustacheRegex.exec(text)) !== null) {
        returnNode.appendChild(
          this.doc.createTextNode(m[mustacheRegex.IDX_PREAMBLE])
        );
        child = this.doc.createElement('span');
        child.innerHTML = m[mustacheRegex.IDX_CONTENT];
        returnNode.appendChild(child);
        this.processElement(child);
      }
    }
  }
  return returnNode;
};

function printOb(ob) {
  if (typeof(ob) === 'object') {
    return '{' + _.map(ob, function(v, k) {
      var props = [];
      if (/^\w+$/.test(k)) {
        props.push(k + ':' + printOb(v));
      } else {
        props.push('"' + JSON.stringify(k) + ':' + JSON.stringify(v));
      }
      return props.join(',');
    }).join(',') + '}';
  } else if (_.isArray(ob)) {
    return '[' + _.map(ob, printOb).join(',') + ']';
  } else {
    return JSON.stringify(ob);
  }
}


Processor.prototype.compile = function(root) {
  this.processElement(root);
  return 'module.exports = new Template(' +
         printOb(this.references) + ',' +
         '"' + serializeDocument(root).replace(/"/g, '\\"') + '");';
};

Processor.prototype.create = function(root) {
  this.processElement(root);
  return template(
    this.references,
    serializeDocument(root)
  );
};

/**
 * @param {string} html
 * @param {object} opts
 * @returns {string}
 */
module.exports = {
  compile: function(html, opts) {
    opts = opts || {};
    var doc = jsdom('<html><body><div>'+html+'</div></html></body>');
    return new Processor(doc, opts).compile(doc.body.firstChild);
  },
  create: function(html, opts) {
    opts = opts || {};
    var doc = jsdom('<html><body><div>'+html+'</div></html></body>');
    return new Processor(doc, opts).create(doc.body.firstChild);
  }
};

console.log(module.exports.compile(
  '<body><p id="{{bar}}">baz <span>{{bap}}</span></p></body>',
  {verbose: true}
));
