'use strict';

var mongoose = require('mongoose-q')(),
	  Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.Types.ObjectId;

var AttributeValueSchema = new Schema({
	parent: {
		type: ObjectId,
		ref: 'AttributeValue',
		required: false
	},
  attribute: {
		type: ObjectId,
		ref: 'Attribute',
		required: 'Every value must refer to an attribute'
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


module.exports = mongoose.model('AttributeValue', AttributeValueSchema);
