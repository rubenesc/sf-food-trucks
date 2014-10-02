
define([], function() {

  var MapManager = (function() {

    function MapManager(element, opts) {
      
      //Create a global info window
      this.infowindow = new google.maps.InfoWindow();

      this.gMap = new google.maps.Map(element, opts);

      this.markers = []; //keep track of created markers
      this.currentPosition;

      //Add Map Listener when the map is dragged.
      var self = this;
      google.maps.event.addListener(this.gMap, "dragend", function(e){

          var c = self.gMap.getCenter();
          if (c){
            vent.trigger("map:findNearByItems", {lat: c.lat(), lng: c.lng()});
          }

      });
      
    }

    MapManager.prototype = {

      createMarkers: function(trucks){

        // add a marker to the map for every truck
        var self = this;
        trucks.forEach(function(truck){

          if (truck.get("loc") && truck.get("loc").coordinates && truck.get("loc").coordinates.length === 2){

            var icon = (truck.get("type") === 'Push Cart') ? 'images/pushcart.png' : 'images/truck.png';
            
            self.createMarker({
                lng: truck.get("loc").coordinates[0],
                lat: truck.get("loc").coordinates[1],
                icon: icon,
                content: truck.get("name"),
                truckId: truck.get("truckId")
              });       
          }

        });

      },

      createMarker: function(opts, truck) {

        opts.position = {
          lat: opts.lat,
          lng: opts.lng
        }

        opts.map = this.gMap;

        //create the marker
        var marker = new google.maps.Marker(opts);
        
        //if it is a truck add it to the cluster
        if (opts.truckId){
          this.markers.push(marker);
        } else {
          this.currentPosition = marker;
        }

        //if content is denfiend, then attach an info window.
        if (opts.content) {

          var self = this;
          google.maps.event.addListener(marker, "click", function() {

              self.displayInfoWindow(marker);
              //trigger backbone event.
              vent.trigger("truck:locateMarkerOnList", marker);

          });

        }

        return marker;
      },

      getCurrentPosition: function(callback) {

        if (navigator.geolocation) {
          
          navigator.geolocation.getCurrentPosition(function(position) {
            
            callback.call(this, position);

          });

        } else {
            //return with no position
            callback.call(this);
        }

      },

      setCenter: function(lat, lon){
        this.gMap.setCenter(new google.maps.LatLng(lat,lon));
        this.gMap.setZoom(15);
      },

      displayInfoWindow: function(marker){

        this.infowindow.close(); //close any open window.
        this.infowindow.setContent(marker.content);
        this.infowindow.open(this.gMap, marker); //open the new one
      },

      findMarkersBy: function(callback){
        
        var matches = [];
        var cbReturn;

        for (var i=0, l=this.markers.length; i < l; i++){
          cbReturn = callback(this.markers[i]);
          if (cbReturn){
            matches.push(this.markers[i]);
          }
        }

        return matches;
      },

      zoom: function(level) {
        if (level) {
          this.gMap.setZoom(level);
        } else {
          return this.gMap.getZoom();
        }
      },

      removeAllMarkers: function(){
        this.markers.length = 0;
      }


    };

    return MapManager;

  }());

  return  MapManager;

});
