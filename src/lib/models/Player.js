// jshint node:true
'use strict';

var mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var PlayerSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	email: {
		type: String,
		default: '',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});


module.exports = mongoose.model('Player', PlayerSchema);
