/**
 * Position.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		title: {
			type: 'string',
			required: true
		},
		defaultPayRate: {
			type: 'float',
			required: false,
			defaultsTo: '9.5'
		},
		parentPosition: {
			model: 'position',
			required: false
		},
		canApply: {
			type: 'boolean',
			required: false,
			defaultsTo: false
		},
		isDeleted: {
			type: 'boolean',
			required: true,
			defaultsTo: false
		},
	}
};
