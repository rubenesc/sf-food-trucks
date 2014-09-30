
define(['baseView', 'collections/trucks', 'models/truck', 'utils/MapManager'],

function(BaseView, TrucksCol, TruckModel, MapManager) {
  
  var indexView = BaseView.extend({

	el: '.container',

    initialize: function() {

		// var options = MapManager.MAP_OPTIONS,
		var options = {
			center: {
			  lat: 37.791350,
			  lng: -122.435883
			},
			zoom: 12,
			disableDefaultUI: false,
			scrollwheel: true,
			draggable: true,
			minZoom: 10
		};

		// map
		element = document.getElementById('map-canvas'),
		map = new MapManager(element, options);

		//create a marker for each truck
		this.collection.forEach(function(truck){

			if (truck.get("lat") && truck.get("lng")){

			map.createMarker({
			    lat: truck.get("lat"),
			    lng: truck.get("lng"),
			  });		  	
			}

		});

    },

  	events: {
       "click #map-canvas": "clickedOnMap"
  	},


  	clickedOnMap: function(e){

		e.preventDefault();

  	}

  });

  return indexView;

});
