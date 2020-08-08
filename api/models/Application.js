/**
 * Application.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		firstName: {
			type: 'string',
			required: true,
		},
		middleName: {
			type: 'string',
			required: false,
		},
		lastName: {
			type: 'string',
			required: true,
		},
		street: {
			type: 'string',
			required: true,
		},
		city: {
			type: 'string',
			required: true,
		},
		state: {
			type: 'string',
			required: true,
		},
		zip: {
			type: 'string',
			required: true,
		},
		email: {
			type: 'email',		
			required: true
		},
		phone: {
			type: 'string',		
			required: true
		},
		over16: {
			type: 'boolean',		
			required: true
		},
		returning_worker: {
			type: 'boolean',		
			required: true
		},
		previous_role: {
			type: 'text'
		},
		previous_haunt_work: {
			type: 'text'
		},
		comments: {
			type: 'text'
		},
		height: {
			type: 'string'
		},
		gender: {
			type: 'string'
		},
		shirt_size: {
			type: 'string'
		},
		pant_size: {
			type: 'string'
		},
		pant_waist: {
			type: 'string'
		},
		pant_length: {
			type: 'string'
		},
		makeup_allergies: {
			type: 'boolean',		
			required: true
		},
		glasses: {
			type: 'boolean',		
			required: true
		},
		contacts: {
			type: 'boolean',		
			required: true
		},
		preavailability: {
			type: 'string',
			required: true
		},
		availability: {
			type: 'string',
			required: true
		},
		status: {				// 1: pending, 2: hired, 3: held, 4: rejected
			type: 'integer',
			required: true,
			defaultsTo: '1'
		},
		position: {
			model: 'position',
			required: false
		},
		refferedfrom: {
			type: 'string'
		},
		adminNote: {
			type: 'string'
		}
	}
};
