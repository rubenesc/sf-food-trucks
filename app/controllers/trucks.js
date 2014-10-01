
var request = require('request');
var util = require('util');  
var config = require('../../config/config');
var mongoose = require('mongoose');
var Truck = mongoose.model('Truck');


exports.fetchListFromAPI = function(req, res, next) {


	console.log("truck data api ["+config.truckDataAPI+"]");

	var opts = {
		url: config.truckDataAPI,
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
					block: item.block,
				    loc: {
				      type: 'Point',
				      coordinates: [ parseFloat(item.longitude), parseFloat(item.latitude) ]
				    }
				}));

		});

 		Truck.create(models, function(err){

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

	if (req.param('type')){
		criteria.type = req.param('type');		
	}

	if (req.param('food')){
		criteria.foodItems = req.param('food');		
	}	

	if (req.param('truckId')){
		criteria.truckId = req.param('truckId');		
	}	

	if (req.param('name')){
		criteria.name = req.param('name');		
	}	

	if (req.param('lat') && req.param('lon')){
		criteria.lat = req.param('lat');		
		criteria.lon = req.param('lon');		
	}	

	return {
		criteria: criteria,
		limit: limit
	}

}



