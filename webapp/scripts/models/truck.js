
define(['backbone'], function(Backbone){

  var Truck = Backbone.Model.extend({
	
	urlRoot: "/api/trucks",
 
	defaults: {
	},

	parse: function(response){

		//if it comes from calling the API.
		// link: { ... }
		if (response.hasOwnProperty('truck')){
			return response.truck;
		}

		return response;
	}

  });

  return Truck;
});
