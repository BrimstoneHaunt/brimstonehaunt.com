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

Handlebars.registerHelper('currency', function(amount, options) {
    var numericAmount = typeof amount === 'string' ? options.contexts[0].get(amount) : amount;
    var pennies = Math.round(numericAmount * 100);
    var cents = pennies % 100;
    var dollars = Math.round(pennies / 100 - cents / 100);
    var centsStr = '' + cents;
    var result = '$' + dollars + '.' + ( centsStr.length < 2 ? '0'+cents : cents);

    return '$' + dollars + '.' + ( centsStr.length < 2 ? '0' + cents : cents);
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