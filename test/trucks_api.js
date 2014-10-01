
var request = require('request');
var should = require('should');
var app = require('../app');
var mongoose = require('mongoose');
var Truck = mongoose.model('Truck');


describe("Trucks", function(){

	describe("API", function(){

		var result = {};

		before(function(done){

			// Cleanup DB.
			Truck.remove(function(err) {
				
				if(err) return done(err);
				
				done();
			});

		});

		it("load truck data from API", function(done){

			var opts = {
				url: "http://localhost:" + app.settings.port + "/api/trucks/update"
			};

			request(opts, function(err, res, body){

				if (err) return done(err);
				
				res.should.have.status(201);

				done();
			});

		});


		it("list trucks", function(done){

			var opts = {
				url: "http://localhost:" + app.settings.port + "/api/trucks"
			};

			request(opts, function(err, res, body){

				if (err) return done(err);

				res.should.have.status(200);
				res.should.be.json;

				var data = JSON.parse(body);
				data.should.have.property('trucks');
				data.should.have.property('total');
				(data.trucks.length).should.be.a.Number;

				// data.trucks.forEach(function(item, i){
				// 	console.log("["+i+"]["+item.truckId+"]["+item.name+"]");
				// });

				done();
			});

		});

		it("list only Push Carts", function(done){

			var type = "Push Cart";
			var opts = {
				url: "http://localhost:" + app.settings.port + "/api/trucks?type="+type
			};

			request(opts, function(err, res, body){

				if (err) return done(err);

				res.should.have.status(200);
				res.should.be.json;

				var data = JSON.parse(body);
				data.should.have.property('trucks');
				data.should.have.property('total');
				(data.trucks.length).should.be.a.Number;

				data.trucks.forEach(function(item, i){
					if (item.type !== type){
						return done(new Error("item not a push cart: " + item.truckId));
					}
				});

				return done();
			});			

		});



	});



	// it("find truck by id", function(){

	// });

	// it("find truck by location", function(){

	// });

});