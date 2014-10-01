

module.exports = function(app) {
 
	app.get("/", function(req, res){

		return res.render("index");

	});	

	app.namespace('/api', function(){

		var trucks = require('../app/controllers/trucks');
		
		app.get('/trucks', trucks.list);
		app.get('/trucks/update', trucks.fetchListFromAPI);

	});

}





