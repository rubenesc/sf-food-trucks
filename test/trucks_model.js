
var assert = require('assert');
var should = require('should');
var mongoose = require('mongoose');
var Truck = mongoose.model('Truck');
var DistanceHelper = require("../app/helpers/distanceHelper");


describe("Trucks", function(){

	describe("persistence", function(){

		var truck;

		before(function(done){

			//setup test model
			truck = new Truck({
				truckId: "123456", 
				name: "Eva's Catering Test",
				type: "Truck",
				foodItems: "Cold Truck: Burrito: Corn Dog: Salads: Sandwiches: Quesadilla: Tacos: Fried Rice: Cow Mein: Chinese Rice: Noodle Plates: Soup: Bacon: Eggs: Ham: Avacado: Sausages: Beverages",
				address: "1199 ORTEGA ST",
				lng: "-122.4900712081",
				lat: "-37.7835091222127",
				block: "1404"
			});

			done();

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
				data1.lat =  "37.791350";
				data1.lng =  "-122.435883";

				data1.save(function(err2, data2){

					if(err2) return done(err2);

					data2.should.have.be.a('object');
					data2.should.have.property('_id');
					data2.truckId.should.equal(data1.truckId);

					data2.name.should.equal(data1.name);
					data2.type.should.equal(data1.type);
					data2.foodItems.should.equal(data1.foodItems);
					data2.address.should.equal(data1.address);
					data2.lat.should.equal(data1.lat);
					data2.lng.should.equal(data1.lng);

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
				lng: "-122.4900712081",
				lat: "-37.7835091222127",
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

		it("find a truck near", function(done){

			// Divs & Fulton
			var coords = [-122.43822813034058, 37.77687154550712];

			Truck.find({ loc: {
					$nearSphere: coords,
					$maxDistance: 0.01
				} },

				function(err, data){

					if (err) return done(err);

					data.forEach(function(item){
						printItem(item, coords);
					});

					done();
					
				}
			);

		});


		function printItem(item, coords){

			var d = -1;

			if (item.loc.coordinates.length === 2){

				var lat1 = coords[1];
				var lon1 = coords[0];
				var lat2 = item.loc.coordinates[1];
				var lon2 = item.loc.coordinates[0];

				d = DistanceHelper.getDistanceInKm(lat1, lon1, lat2, lon2);
			}

			return console.log("["+item.truckId+"]["+item.name+"]["+d+"]"); 
		}



		// it("find truck based on food item", function(done){

		// 	Truck.find(
		// 		{ $text : { $search : 'Burrito' } }

		// 	  ).exec(function(err, data) {

		// 	  	if (err) return done(err);

		// 	  	console.dir(data);


		// 	    // assert.ifError(error);
		// 	    // assert.equal(2, documents.length);
		// 	    // assert.equal('text search in mongoose', documents[0].title);
		// 	    // assert.equal('searching in mongoose', documents[1].title);
		// 	    // db.close();
		// 	    done();

		// 	  });

		// });


	});

});