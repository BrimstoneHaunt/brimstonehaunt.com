Handlebars = require('handlebars');

Handlebars.registerHelper('nl2br', function(data) {
	var out = data;
	if(data) {
		out = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
	}
	return out;
});

Handlebars.registerHelper('eq', function(a, b) {
	return a == b;
});

Handlebars.registerHelper('eqq', function(a, b) {
	return a === b;
});

Handlebars.registerHelper('neq', function(a, b) {
	return a != b;
});

Handlebars.registerHelper('neqq', function(a, b) {
	return a !== b;
});

Handlebars.registerHelper('gt', function(a, b) {
	return a > b;
});

Handlebars.registerHelper('gteq', function(a, b) {
	return a >= b;
});

Handlebars.registerHelper('lt', function(a, b) {
	return a < b;
});

Handlebars.registerHelper('lteq', function(a, b) {
	return a <= b;
});

Handlebars.registerHelper('mapAccessLvl', function(data) {
	var out = data;
	
	switch(data) {
		case 1:
			out = "Employee";
			break;
		case 2:
			out = "Supervisor";
			break;
		case 3:
			out = "Management";
			break;
		case 4:
			out = "Upper Management";
			break;
		case 5:
			out = "Administrator";
			break;
		default:
			out = "Unknown Access Level " + data;
	}
	
	return out;
});