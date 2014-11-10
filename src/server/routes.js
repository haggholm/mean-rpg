//jshint node:true
'use strict';

var paths = require('./paths');

var Skill = require(paths.lib('models/Skill'));


module.exports = function(app) {
	app.route('/api/users/')
		.get(function(req, res) {
      res.json(['Hullo']);
    })
//		.post(users.requiresLogin, articles.create);
  ;

  app.route('/api/skills/')
    .get(function(req, res) {
      res.json(Skill.find());
    })
    .post(function(req, res) {
      var skill = new Skill(req.body);

      skill.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: 'Error'//errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(skill);
        }
      });
    });
//  app.route('/users/:id')
//    .get('Hullo');

//	app.route('/articles/:articleId')
//		.get(articles.read)
//		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
//		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
//
//	// Finish by binding the article middleware
//	app.param('articleId', articles.articleByID);
};
