module.exports = {
	index: function(req, res) {
		return res.view('timeclock', {
			layout: 'management',
			title: 'Time Clock'
		});
	}
}