'use strict';

var attributeRoutes = require('./routes/attributes'),
    authRoutes = require('./routes/auth');


module.exports = function(app) {
	app.route('/api/users/')
		.get(function(req, res) {
      res.json(['Hullo']);
    });

  app.use('/api/auth', authRoutes);
  app.use('/api/attributes', attributeRoutes);
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
