define(['utils/googleMapsLoader', 'utils/markerClusterer'],

function(GoogleMapsLoader) {

  var MapManager = (function() {

    function MapManager(element, opts) {

      this.gMap = new google.maps.Map(element, opts);

      this.markers = []; //keep track of created markers
      this.markersMap = {}; //keep track of created markers

      //create a marker cluster to group truck markers
      this.markerClusterer = new MarkerClusterer(this.gMap, this.markers);
      
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
          this.markerClusterer.addMarker(marker);
        }

        //if content is denfiend, then attach an info window.
        if (opts.content) {

          var self = this;
          google.maps.event.addListener(marker, "click", function() {

                var infoWindow = new google.maps.InfoWindow({
                    content: opts.content
                });
            
              infoWindow.open(self.gMap, marker);
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

    };

    return MapManager;

  }());

  return  MapManager;

});
