'use strict';

var express = require('express')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


var authRoutes = express.Router();
authRoutes.route('/login')
  .post(passport.authenticate('local', { successRedirect: '/',
                                         failureRedirect: '/login' }));

module.exports = authRoutes;
