Handlebars = require('handlebars');

Handlebars.registerHelper('objArr2str', function(arr, attr) {
	var out = "";
	if(arr) {
		for(var i = 0;i < arr.length;i++) {
			out += arr[i][attr] + ",";
		}
	}
	return out;
});

Handlebars.registerHelper('space2nbs', function(data) {
	var out = data;
	if(data) {
		out = data.replace(/(?:\s)/g, '&nbsp;');
	}
	return out;
});

Handlebars.registerHelper('nl2br', function(data) {
	var out = data;
	if(data) {
		out = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
	}
	return out;
});

Handlebars.registerHelper('nl2charCode', function(data) {
	var out = data;
	var newline = String.fromCharCode(13, 10);
	if(data) {
		out = data.replace(/(?:\r\n|\r|\n)/g, '&#10;');
	}
	return out;
});

Handlebars.registerHelper('and', function(a, b) {
	return a && b;
});

Handlebars.registerHelper('or', function(a, b) {
	return a || b;
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

Handlebars.registerHelper('currency', function(amount) {
    var numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
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