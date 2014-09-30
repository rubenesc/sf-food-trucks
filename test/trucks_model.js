
var assert = require('assert');
var should = require('should');
var mongoose = require('mongoose');
var Truck = mongoose.model('Truck');


describe("Trucks", function(){

	describe("persistence", function(){

		var truck;

		before(function(done){

			//setup test model
			truck = new Truck({
				truckId: "123456", 
				name: "Eva's Catering",
				type: "Truck",
				foodItems: "Cold Truck: Burrito: Corn Dog: Salads: Sandwiches: Quesadilla: Tacos: Fried Rice: Cow Mein: Chinese Rice: Noodle Plates: Soup: Bacon: Eggs: Ham: Avacado: Sausages: Beverages",
				address: "1199 ORTEGA ST",
				longitude: "-122.4900712081",
				latitude: "-37.7835091222127",
				block: "1404"
			});

			// Cleanup DB.
			Truck.remove(function(err) {
				
				if(err) return done(err);
				
				done();
			});

		});

		it("create a new truck", function(done){

			truck.save(function(err, data){

				if(err) return done(err);

				data.should.have.be.a('object');
				data.should.have.property('_id');
				done();

			});

		});


		it("find a truck by truckId", function(done){

			Truck.loadBy({"truckId": truck.truckId}, function(err, data){

				if(err) return done(err);

				data.should.have.be.a('object');
				data.should.have.property('_id');
				data.truckId.should.equal(truck.truckId);
				data.name.should.equal(truck.name);
				done();

			});

		});

		it("find a truck by name", function(done){

			Truck.loadBy({"name": truck.name}, function(err, data){

				if(err) return done(err);

				data.should.have.be.a('object');
				data.should.have.property('_id');
				data.truckId.should.equal(truck.truckId);
				data.name.should.equal(truck.name);
				done();

			});

		});

		it("update a trucks attributes", function(done){

			Truck.loadBy({"truckId": truck.truckId}, function(err1, data1){

				if(err1) return done(err1);

				data1.name = truck.name + " updated 1";
				data1.type =  data1.type + " updated 2";
				data1.foodItems =  data1.foodItems + ": updated 3";
				data1.address =  data1.address + " updated 4";
				data1.latitude =  "37.791350";
				data1.longitude =  "-122.435883";

				data1.save(function(err2, data2){

					if(err2) return done(err2);

					data2.should.have.be.a('object');
					data2.should.have.property('_id');
					data2.truckId.should.equal(data1.truckId);

					data2.name.should.equal(data1.name);
					data2.type.should.equal(data1.type);
					data2.foodItems.should.equal(data1.foodItems);
					data2.address.should.equal(data1.address);
					data2.latitude.should.equal(data1.latitude);
					data2.longitude.should.equal(data1.longitude);

					done();

				});

			});

		});


		it("not create a truck with an existing truck id", function(done){

			var truck2 = new Truck({
				truckId: truck.truckId, 
				name: "Eva's Catering 2",
				type: "Truck",
				foodItems: "Cold Truck: Burrito: Corn Dog: Salads: Sandwiches: Quesadilla: Tacos: Fried Rice: Cow Mein: Chinese Rice: Noodle Plates: Soup: Bacon: Eggs: Ham: Avacado: Sausages: Beverages",
				address: "1199 ORTEGA ST",
				longitude: "-122.4900712081",
				latitude: "-37.7835091222127",
				block: "1404"
			});

			truck2.save(function(err, data){

				if(err && err.code === 11000) {
					return done(); //duplicate key. good.
				}

				if (err) return done(err);

				//it should error out
				err.should.have.be.a('object');
				
			});

		});










		// it("should not create a duplicate truck id", function(done){

		// 		truck.save(function(err, data){

		// 		if(err) return done(err);

		// 		data.should.have.be.a('object');
		// 		data.should.have.property('_id');
		// 		done();

		// 	});			

		// });	

	});

	// describe("load data from API", function(){

	// 	var result = {};
	// 	before(function(){
	// 	});

	// 	it("is successful", function(){
	// 	});

	// });



	// it("find truck by id", function(){

	// });

	// it("find truck by location", function(){

	// });

});