'use strict';

var _ = require('lodash');


/**
 * @returns {number}
 */
function roll() {
  var x, sum = 0;
  do {
    x = _.random(1, 10);
    sum += x;
  } while(x === 10);
  return sum;
}

/**
 * @param {number} advantage
 * @param {number} iterations
 * @param {object} [diffs=null]
 * @returns {{wins: number, losses: number, draws: number}}
 */
function simulateAtDiff(advantage, iterations, diffs) {
  var wins = 0, draws = 0, losses = 0, total = 0
    , diff, times;
  while (total++ < iterations) {

    // When advantage === 0 (even match), count occurrences
    // of the specific diff.
    if (advantage === 0) {
      diff = roll() - roll();
      times = diffs[diff];
      diffs[diff] = times === undefined ? 1 : times+1;
    } else {
      diff = roll() + advantage - roll();
    }

    if (diff > 0) {
      wins++;
    } else if (diff < 0) {
      losses++;
    } else {
      draws++;
    }
  }

  return {
    wins: 100 * wins / iterations,
    losses: 100 * losses / iterations,
    draws: 100 * draws / iterations
  };
}

/**
 * @returns {{statsByAdvantage: {}, diffBreakdown: Array}}
 */
function run() {
  var million = 1000000, nMillions = 1;
  var iterations = nMillions * million
    , res = {}
    , keys = []
    , diffs = {};
  for (var advantage = 0; advantage++ < 22;) {
    keys.push(advantage);
    res[advantage] = simulateAtDiff(advantage, iterations, diffs);
  }

  var diffKeys = _.keys(diffs).sort()
    , diffBreakdown = []
    , diff
    , cumulativeResult = 0, timesDiffFound;
  for (var i = 0; i < diffKeys.length; i++) {
    diff  = diffs[diffKeys[i]];
    timesDiffFound = diffKeys[i];
    cumulativeResult += timesDiffFound;
    diffBreakdown.push({
      result: timesDiffFound,
      percentage: diffKeys[i] / iterations,
      cumulativePercentage: cumulativeResult / iterations
    });
  }

  return {
    statsByAdvantage: res,
    diffBreakdown: diffBreakdown
  };
}

module.exports = (function() {
  console.log(run());
})();
