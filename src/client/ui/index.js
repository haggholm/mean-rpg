'use strict';

var templates = require('../templates')
  , View = require('../View');

module.exports = new View({
  selector: 'body',
  render: function(cb) {
    this.render(templates.ui.index({
      menu: require('./menu')()/*,
       automenu: require('./automenu')()*/
    }));
  }
});
