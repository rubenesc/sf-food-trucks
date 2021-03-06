
define(['baseView', 'text!templates/trucks/truck-list-item.html'], 
	function(BaseView, itemTemplate) {

  var truckView = BaseView.extend({

    template: _.template(itemTemplate),

  	events: {
      'click': 'clickItem'
  	},

    initialize: function(){
      this.model.bind('remove', this.unrender);
    },

  	render: function(){
  		
  		if (!this.model.get("foodItems")){
  			this.model.set("foodItems", "");
  		}

  		this.$el.html( this.template(this.model.toJSON()) );
    	return this;
  	},

  	clickItem: function(){
      vent.trigger("truck:locateMarkerOnMap", this.model);
  	},

  	unrender: function(){
		  this.unbind();
      $(this.el).remove();
  	}

  });

  return truckView;
  
});