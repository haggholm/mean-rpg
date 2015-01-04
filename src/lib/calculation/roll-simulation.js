'use strict';

var _ = require('lodash');

var die = 10
  , rolls = 1
  , maxRoll = die * rolls;

var BUF_SIZE = 2 << 11;
//var urandom = function() {
//  urandom.offset += 4;
//  if (urandom.offset >= BUF_SIZE) {
//    urandom.buffer = require('crypto').pseudoRandomBytes(BUF_SIZE);
//    urandom.offset = 0;
//  }
//  return urandom.buffer.readInt32BE(urandom.offset);
//};
//urandom.offset = BUF_SIZE;

var engine;
//if (typeof(require('crypto').pseudoRandomBytes) === 'function') {
//  engine = urandom;
//} else {
  var mt = require('random-js').engines.mt19937();
  mt.autoSeed();
  engine = mt;
//}

var singleRoll = function(rolls, die) {
  var i, sum = 0;
  for (i = rolls; i > 0; i--) {
    sum += require('random-js').integer(1, die)(engine);
  }
  return sum;
};

/**
 * @returns {number}
 */
function roll(rolls, die) {
  var x, sum = 0, maxRoll = rolls * die;
  do {
    sum += (x = singleRoll(rolls, die));
  } while(x === maxRoll);
  return sum;
}

/**
 * @param {number} advantage
 * @param {number} iterations
 * @returns {{wins: number, losses: number, draws: number}}
 */
function simulateAtDiff(advantage, iterations) {
  var wins = 0, draws = 0, losses = 0, diff;

  for (var i = iterations; i > 0; i--) {
    diff = roll(rolls, die) + advantage - roll(rolls, die);
    if      (diff > 0) wins++;
    else if (diff < 0) losses++;
    else               draws++;
  }

  var divisor = iterations / 100;
  return {
    wins:   wins / divisor,
    losses: losses / divisor,
    draws:  draws  / divisor
  };
}

/**
 * @returns {{statsByAdvantage: {}, diffBreakdown: Array}}
 */
function run(nMillionIterations) {
  var iterations = nMillionIterations * 1000000
    , res = {}
    , keys = [];
  var range = 2 * (maxRoll+1);
  var overallT0 = process.hrtime();
  for (var advantage = 0; advantage < range; advantage++) {
    keys.push(advantage);

    process.stdout.write(chalk.green('Processing advantage '+advantage+'...'));
    var t0 = process.hrtime();

    res[advantage] = simulateAtDiff(advantage, iterations);

    var dt = process.hrtime(t0);
    process.stdout.write(
      require('chalk').green('done ') +
      require('chalk').yellow('[' + (dt[0]+dt[1]/1e9).toFixed(2)+'s]') +
      '\n'
    );
  }
  var overallT1 = process.hrtime(overallT0);
  console.log(
    require('chalk').yellow(
      'Total '+(overallT1[0]+overallT1[1]/1e9).toFixed(2)+'s'
    )
  );

  return {
    stats: res
  };
}
run.meanRoll = function(rolls, die, bonus) {
  var i
    , rollSum = 0
    , iterations = 1000000;
  bonus = bonus === undefined ? 0 : bonus;
  for (i = iterations; i > 0; i--) {
    rollSum += roll(rolls, die) + bonus;
  }
  return rollSum / iterations;
};

module.exports = run;
