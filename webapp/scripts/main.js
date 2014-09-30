require.config({

  paths: {

    jquery: 'vendor/jquery/jquery',
    underscore: 'vendor/underscore/underscore',
    backbone: 'vendor/backbone/backbone',
    bootstrap: 'vendor/bootstrap/bootstrap',
    text: 'vendor/requirejs-text/text',
    templates: '../templates',
    baseView: 'views/baseView'
  },

  shim: {

    backbone: {
        deps: ["underscore", "jquery"],
        exports: "Backbone"
    },

    bootstrap: {
        deps: ["jquery"],
    },

    app: {
        deps: ["underscore", "backbone"],
        exports: "app"
    }    

  }

});

require(['backbone', 'views/index', 'collections/trucks'], 

  function(Backbone, IndexView, TrucksCol){

    //helper method to fire events
    window.vent = _.extend({}, Backbone.Events);

    //helper method to find a template
    window.template = function(id){
      return _.template($('#'+id).html());
    }

    //initialize Index View
    var trucks = new TrucksCol();

    trucks.fetch().then(function(){
        var indexView = new IndexView({collection: trucks});
    });

});


