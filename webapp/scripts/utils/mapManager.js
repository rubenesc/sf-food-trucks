define(['utils/googleMapsLoader'],

function(GoogleMapsLoader) {

  var MapManager = (function() {

    function MapManager(element, opts) {

      this.gMap = new google.maps.Map(element, opts);

    }

    MapManager.prototype = {

      createMarker: function(opts) {

        opts.position = {
          lat: opts.lat,
          lng: opts.lng
        }

        opts.map = this.gMap;

        //create the marker
        var marker = new google.maps.Marker(opts);

        return marker;
      }


    };

    return MapManager;

  }());
  
  return  MapManager;

});
