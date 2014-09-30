
define(['backbone', 'models/truck'], function(Backbone, Truck) {

  var Truck = Backbone.Collection.extend({

	url: "/api/trucks",

    model: Truck,

    //this is because our server response is different
    //then what backbone expects
	parse: function(response){
		this.total = response.total;
		return response.trucks;
	}

  });

  return Truck;
});