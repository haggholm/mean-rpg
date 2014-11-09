// jshint node:true
'use strict';


module.exports = function(app) {
	// Article Routes
	app.route('/users/')
		.get(function(req, res) {
      res.json(['Hullo']);
    })
//		.post(users.requiresLogin, articles.create);
  ;
  app.route('/users/:id')
    .get('Hullo');

//	app.route('/articles/:articleId')
//		.get(articles.read)
//		.put(users.requiresLogin, articles.hasAuthorization, articles.update)
//		.delete(users.requiresLogin, articles.hasAuthorization, articles.delete);
//
//	// Finish by binding the article middleware
//	app.param('articleId', articles.articleByID);
};
