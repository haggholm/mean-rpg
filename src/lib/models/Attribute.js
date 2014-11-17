'use strict';

var mongoose = require('mongoose-q')(),
	  Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var AttributeSchema = new Schema({
	parent: {
		type: ObjectId,
		ref: 'Attribute',
		required: false
	},
  name: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
  type: {
    type: String,
    default: 'skill',
    enum: ['skill', 'attribute'],
    required: 'Every attribute must have a type'
  },
	description: {
		type: String,
		default: '',
		trim: true,
    required: 'Description may not be empty'
	}
});


module.exports = mongoose.model('Attribute', AttributeSchema);
