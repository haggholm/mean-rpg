var templateDom = require('./template-dom')
  , jsdom = require('jsdom')
  , Template = require('./Template');


var doc = jsdom.jsdom('<html><body></body></html>');
Template.createElement = doc.createElement.bind(doc);

var t = templateDom.create('<div><p>{{foo}}</p> {{bar}}</div>');


doc.body.appendChild(t({foo: 'fool', bar: 'bart'}));
console.log(jsdom.serializeDocument(doc));
