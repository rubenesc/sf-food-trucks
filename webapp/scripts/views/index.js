
define(['baseView', 'collections/trucks', 'models/truck', 'utils/MapManager'],

function(BaseView, TrucksCol, TruckModel, MapManager) {
  
  var indexView = BaseView.extend({

	el: '.container',

    initialize: function() {

    	this.createMapAndInitalizeData();

    	//set the users current position on the map
    	map.getCurrentPosition(function(position){

			map.createMarker({
			    lat: position.coords.latitude,
			    lng: position.coords.longitude
			  });		  	
			
    	});    	

    },

  	events: {
       "click #map-canvas": "clickedOnMap"
  	},


  	clickedOnMap: function(e){

		e.preventDefault();

  	},

  	createMapAndInitalizeData: function(){

		//initial maps options
		var mapOptions = {

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

		// create the map
		element = document.getElementById('map-canvas'),
		map = new MapManager(element, mapOptions);

		// add a marker to the map for every truck
		this.collection.forEach(function(truck){

			if (truck.get("lat") && truck.get("lng")){

				var icon = (truck.get("type") === 'Push Cart') ? 'images/pushcart.png' : 'images/truck.png';
				map.createMarker({
				    lat: truck.get("lat"),
				    lng: truck.get("lng"),
				    icon: icon,
				    content: truck.get("name"),
				    truckId: truck.get("truckId")
				  });		  	
			}

		});

  	}

  });

  return indexView;

});
