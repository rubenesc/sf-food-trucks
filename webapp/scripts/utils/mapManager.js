define(['utils/googleMapsLoader', 'utils/markerclusterer'],

function(GoogleMapsLoader) {

  var MapManager = (function() {

    function MapManager(element, opts) {

      this.gMap = new google.maps.Map(element, opts);

      this.markers = []; //keep track of created markers
      this.markersMap = {}; //keep track of created markers

      //create a marker cluster to group truck markers
      this.markerClusterer = new MarkerClusterer(this.gMap, []);

      google.maps.event.addListener(this.gMap, "click", function(e){
        console.log(e);
      });
      
    }

    MapManager.prototype = {

      createMarker: function(opts, truck) {

        opts.position = {
          lat: opts.lat,
          lng: opts.lng
        }

        opts.map = this.gMap;

        //create the marker
        var marker = new google.maps.Marker(opts);
        this.markers.push(marker);

        //if it is a truck add it to the cluster
        if (opts.truckId){
          //this.markerClusterer.addMarker(marker);
        }

        //if content is denfiend, then attach an info window.
        if (opts.content) {

          var self = this;
          google.maps.event.addListener(marker, "click", function() {

                var infoWindow = new google.maps.InfoWindow({
                    content: opts.content
                });
            
              infoWindow.open(self.gMap, marker);

              //trigger backbone event.
              vent.trigger("truck:locateMarkerOnList", marker);
          });

        }

        return marker;
      },

      getCurrentPosition: function(callback) {

        if (navigator.geolocation) {
        
          navigator.geolocation.getCurrentPosition(function(position) {
            // callback(position);
            callback.call(this, position);
          });

        }
      },

      setCenter: function(lat, lon){
        this.gMap.setCenter(new google.maps.LatLng(lat,lon));
        this.gMap.setZoom(16);
      },

      displayInfoWindow: function(marker){

        var infowindow = new google.maps.InfoWindow({
          content: marker.content
        });

        infowindow.open(this.gMap, marker);
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
      }


    };

    return MapManager;

  }());

  return  MapManager;

});
