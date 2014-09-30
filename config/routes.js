
module.exports = function(app, passport, auth) {


	var trucks = require('../app/controllers/trucks');

	app.namespace('/api', function(){

		app.get('/trucks', trucks.list);
		app.get('/trucks/update', trucks.fetchListFromAPI);
		
	});

}





