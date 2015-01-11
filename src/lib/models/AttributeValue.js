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
  points: {
    type: Number,
    default: 0,
    required: 'Required'
  }
});


module.exports = mongoose.model('AttributeValue', AttributeValueSchema);
