'use strict';

var _ = require('lodash'),
    debug = require('debug')('rpg'),
    express = require('express');

var config = require('../config'),
    Attribute = require(config.paths.lib('models/Attribute'));

var attrRoutes = express.Router();
attrRoutes.route('/')
  .get(function(req, res) {
    Attribute.find().exec(function(err, attributes) {
      if (err) {
        return res.status(400).send({
          message: 'Error'//errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(attributes);
      }
    });
  })
  .post(function(req, res) {
    var attribute = new Attribute(req.body);

    attribute.save(function(err) {
      if (err) {
        return res.status(400).send({
          message: 'Error'//errorHandler.getErrorMessage(err)
        });
      } else {
        console.log('Created new attribute: '+attribute.name);
        res.json(attribute);
      }
    });
  });

attrRoutes.param('attributeId', function(req, res, next, attributeId) {
   Attribute.findById(attributeId).exec()
      .then(function(attr) {
        req.attribute = attr;
        next();
      }, function(err) {
        next();
      });
  });

attrRoutes.route('/:attributeId')
  .put(function(req, res, next) {
    debug('put attr');
    var attr = _.extend(req.attribute, req.body);
    attr.save(function(err) {
      if (err) {
        // ...
      } else {
        res.json(attr);
      }
    });
  })
  .delete(function(req, res, next) {
    req.attribute.delete().then(next);
  })
  .get(function(req, res) {
    debug('get attr');
    res.json(req.attribute);
  });

module.exports = attrRoutes;
