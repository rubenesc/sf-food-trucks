
var request = require('request');
var util = require('util');  

var mongoose = require('mongoose');
var Truck = mongoose.model('Truck');


exports.fetchListFromAPI = function(req, res, next) {

	var opts = {
		url: "http://data.sfgov.org/resource/rqzj-sfat.json",
	};

	request(opts, function(err, requestRes, body){

		if (err) return next(err);

		var models = [];
		var data = JSON.parse(body);

		data.forEach(function(item, index){

			models.push(new Truck({
					truckId: item.objectid, 
					name: item.applicant, 
					type: item.facilitytype, 
					foodItems: item.fooditems, 
					address: item.address, 
					longitude: item.longitude, 
					latitude: item.latitude, 
					block: item.block 
				}));

		});

 		Truck.create(models, function(err){

			//if error is a unique index constraint ignore it.
			if (err && !err.code && !err.code===11000){
				return res.send(400, {errors: err} );
			}

			return res.send(201);
		});

 
	});


}

exports.list = function(req, res, next) {

	var opts = retrieveListOptions(req);

	Truck.list(opts, function(err1, data){
	
		if (err1) return next(err1);

	    Truck.count().exec(function (err2, count) {

			if (err2) return next(err2);

			res.send({
				trucks: data, 
        		total: count
			});

	    });		

	});

}


function retrieveListOptions(req){

	//number of individual objects that are returned in each page. 
	var limit = (req.param('limit') > 0 && req.param('limit') < 50) 
					? req.param('limit') : 1000;

	//conditionally add members to object
	var criteria = {};

	if (req.body.type) criteria.type = req.body.type;
	if (req.body.food) criteria.food = req.body.food;
	if (req.body.lat && req.body.lon){
		criteria.lat = req.body.lat;	
		criteria.lon = req.body.lon;	
	} 

	return {
		criteria: criteria,
		limit: limit
	}

}



