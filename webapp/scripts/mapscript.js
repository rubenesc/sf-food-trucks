

(function(window, google) {
  
  // map options
  var options = {
    center: {
      lat: 37.791350,
      lng: -122.435883
    },
    zoom: 12,
    disableDefaultUI: false,
    scrollwheel: true,
    draggable: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    minZoom: 10
  };

  var element = document.getElementById('map-canvas');

  // map
  map = new google.maps.Map(element, options);

  console.log("map ["+ map.getZoom()+"]");

  //set Events
  google.maps.event.addListener(map, 'click', function(e){
  	console.log("click");
  	console.dir(e);

  	console.log(marker);

  });

  google.maps.event.addListener(map, 'dragend', function(){
  	console.log("finished dragging");
  });

  google.maps.event.addListener(map, 'zoom_changed', function(){
  	console.log("zoom changed ["+map.getZoom()+"]");
  });

  //set initial marker
  var marker = createMarker({
  	lat: 37.791350, 
  	lng: -122.435883, 
  	icon: "http://mapicons.nicolasmollet.com/wp-content/uploads/mapicons/shape-default/color-c03638/shapecolor-color/shadow-1/border-dark/symbolstyle-contrast/symbolshadowstyle-dark/gradient-iphone/robbery.png"
  });

  var marker2 = createMarker({
  	lat: 37.759858513184625, 
  	lng: -122.41395950317383,
  	infoWindow: "I like food 2",
  	event: {
  		name: "click",
  		cb: function(){
  			alert("jejjejeje");
  		}
  	}
  });

  var marker3 = createMarker({
  	lat: 37.781350, 
  	lng: -122.41395950317383,
  	infoWindow: "I like food 3"
  });


  //util functions
  function createMarker(opts){

  	var marker;
  	opts.map = map;
  	opts.position= {
  		lat: opts.lat,
  		lng: opts.lng
  	};

	marker = new google.maps.Marker(opts);

	//if the marker has an event defined, add it.
  	if (opts.event){
	  google.maps.event.addListener(marker, opts.event.name, opts.event.cb);
  	}

  	//if the the marker has an infowindow defined, add it.
  	if (opts.infoWindow){

	  google.maps.event.addListener(marker, "click", function(){

		var infoWindow = new google.maps.InfoWindow({
			content: opts.infoWindow
		});

		infoWindow.open(map, marker);

	  });

  	}

	return marker;
  };

}(window, google));