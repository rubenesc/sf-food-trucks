
define(['baseView', 'views/trucks/trucks', 'collections/trucks', 'models/truck', 'utils/mapManager', 'utils/googleMapsLoader'],

function(BaseView, TrucksView, TrucksCol, TruckModel, MapManager, GoogleMapsLoader) {
  
  var indexView = BaseView.extend({

	el: '.container',

	map: null,

	trucksView: null,

    initialize: function() {

    	//listen for backbone events.
      	vent.on("map:findNearByItems", this.findNearByItems, this);
		vent.on("truck:locateMarkerOnMap", this.locateMarkerOnMap, this);    	
		vent.on("truck:locateMarkerOnList", this.locateMarkerOnList, this);    	
		vent.on("truck:refreshTrucks", this.refreshTrucks, this);    	

    	this.createMap();

    	//set the users current position on the map
    	var self = this;
    	map.getCurrentPosition(function(position){

			//if we have a position set a marker	
			map.createMarker({
			    lat: position.coords.latitude,
			    lng: position.coords.longitude
			  });		

			 map.setCenter(position.coords.latitude, position.coords.longitude);

			 self.findNearByItems({lat: position.coords.latitude, 
			 						lng: position.coords.longitude});

    	});    

		this.trucksView = new TrucksView({collection: this.collection});
		$("#trucks-list").append(this.trucksView.render().el);

    },

  	events: {
       "click #map-canvas": "clickedOnMap"
  	},


  	clickedOnMap: function(e){

		e.preventDefault();

  	},

  	createMap: function(){

		//initial maps options
	    var mapOptions = {
	      center: {
	        lat: 37.791350,
	        lng: -122.435883
	      },
	      zoom: 15,
	      disableDefaultUI: false,
	      scrollwheel: false,
	      draggable: true,
	      minZoom: 10
	    };

	    //Only when the Google Maps is loaded can I use it.
		GoogleMapsLoader.done(function(){
			
			// create the map
			element = document.getElementById('map-canvas'),
			map = new MapManager(element, mapOptions);

		}).fail(function(){ 
		  console.error("ERROR: Google maps library failed to load");
		});  

  	}, 

  	findNearByItems: function(coordinates){

		var self = this;

		var apiUrl = '/api/trucks?lat='+coordinates.lat+'&lon='+coordinates.lng;

		$.ajax( {
		  url: apiUrl,
		  type: 'get',
		  processData: false,
		  contentType: false,
		    success: function(response){

				vent.trigger("truck:refreshTrucks", response.trucks);

		    },
		    error: function(xhr){
		    	//handle error
		    }
		}); 		

  	},

  	refreshTrucks: function(trucksArr){


  		map.removeAllMarkers();
  		// this.collection = new TrucksCol(trucksArr);
		
		while (model = this.collection.first()) {
		  model.destroy();
		}

		for (var i = 0; i < trucksArr.length; i++){
			this.collection.add(new TruckModel(trucksArr[i]));	
		}

		map.createMarkers(this.collection);

  	},

  	locateMarkerOnMap: function(item){

  		//find the marker based on the truckId
  		var found = map.findMarkersBy(function(marker){
  			return marker.truckId === item.get("truckId");
  		});

  		//display the info window of the given marker
  		found.forEach(function(item){
  			map.displayInfoWindow(item);
			map.setCenter(item.get("lat"), item.get("lng"));
			map.zoom(15);
  		});
  	}, 

  	locateMarkerOnList: function(item){

  		document.getElementById("truck-"+item.get("truckId")).focus();

      	var lng = item.get("lng");
    	var lat = item.get("lat");
  	}

  });

  return indexView;

});
