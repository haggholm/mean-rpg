// jshint node:true
'use strict';

var mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

var SkillSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	description: {
		type: String,
		default: '',
		trim: true,
    required: 'Description may not be empty'
	}
});


module.exports = mongoose.model('Skill', SkillSchema);
