'use strict';

var app = require('../app')
  , d3 = require('d3-browserify');
var WIN_KEY = '% wins'
  , DRAW_KEY = '% draws'
  , LOSS_KEY = '% lost';

app.service('D3UtilService', function() {
  var colourMap = {};
  var saturation = 2/3, lightness = 0.5;
  colourMap[WIN_KEY] = d3.hsl(110, saturation, lightness);
  colourMap[DRAW_KEY] = d3.hsl(37, saturation, lightness);
  colourMap[LOSS_KEY] = d3.hsl(2, saturation, lightness);

  var minHue = 2, maxHue = 110;
  return {
    getColour: function(v) {
      var hue = minHue + (maxHue-minHue)*(v/100);
      console.log(v, hue);
      return d3.hsl(hue, saturation, lightness);
    }
  };
});
