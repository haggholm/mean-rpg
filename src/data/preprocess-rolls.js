'use strict';

var _ = require('lodash')
  , chalk = require('chalk');


var cmp = function(a, b) {
  var x = a[0], y = b[0];
  return x === y ? 0 : (x < y ? -1 : +1);
};

var WIN_KEY = '% wins'
  , DRAW_KEY = '% draws'
  , LOSS_KEY = '% lost';

function mirror(wins, draws, losses) {
  var wins2 = new Array(wins.length * 2 - 1)
    , draws2 = new Array(wins.length * 2 - 1)
    , losses2 = new Array(wins.length * 2 - 1);
  var mid = wins.length-1;
  for (var i = wins.length-1; i > 0; i--) {
    var adv = wins[i][0]
      , w = wins[i][1]
      , d = draws[i][1]
      , l = losses[i][1];
    wins2[mid+i]   = [+adv, w];
    wins2[mid-i]   = [-adv, l];
    draws2[mid+i]  = [+adv, d];
    draws2[mid-i]  = [-adv, d];
    losses2[mid+i] = [+adv, l];
    losses2[mid-i] = [-adv, w];
  }
  wins2[mid] = wins[0];
  draws2[mid] = draws[0];
  losses2[mid] = losses[0];
  return [wins2, draws2, losses2];
}

function formatData(simdata, noDraws) {
  var wins = []
    , draws = []
    , losses = [];
  _.forOwn(simdata, function(value, key) {
    var advantage = Number(key);

    if (noDraws) {
      var total = value.wins + value.draws + value.losses
        , w = value.wins
        , d = value.draws
        , l = value.losses
        , wRatio = w / total;
      wins.push([advantage, w + d * wRatio]);
      draws.push([advantage, 0]);
      losses.push([advantage, l + d * (1-wRatio)]);
    } else {
      wins.push([advantage, value.wins]);
      draws.push([advantage, value.draws]);
      losses.push([advantage, value.losses]);
    }
  });
  wins.sort(cmp);
  draws.sort(cmp);
  losses.sort(cmp);

  var finalData;
  if (wins[0][0] === 0) {
    finalData = mirror(wins, draws, losses);
  } else {
    finalData = [wins, draws, losses];
  }
  return [
    { key: WIN_KEY, values: finalData[0] },
    { key: DRAW_KEY, values: finalData[1] },
    { key: LOSS_KEY, values: finalData[2] }
  ];
}

var data = {
  meanRoll: require('./rolls.json').meanRoll,
  oddsVsAdvantageData: formatData(require('./rolls.json').stats),
  oddsVsAdvantageDataNoDraw: formatData(require('./rolls.json').stats, true)
};

require('fs').writeFile('rolls.processed.json', JSON.stringify(data),
  function(err) {
    if (err) {
      console.log(chalk.red(err));
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
