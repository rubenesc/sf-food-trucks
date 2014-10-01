
define(['baseView', 'views/trucks/truck'], 
	function(BaseView, TruckView) {

  var trucksView = BaseView.extend({

    tagName: 'div',

  	initialize: function(){
  		this.collection.on('add', this.addOnePrepend, this); 
  	},

  	render: function(){
		this.collection.each(this.addOne, this);
		return this;
  	},

  	addOne: function(item){
		var truckView = new TruckView({model: item});
		this.$el.append(truckView.render().el); 
  	},

    addOnePrepend: function(item){
		//each item from the collection.
		var truckView = new TruckView({model: item});
		this.$el.prepend(truckView.render().el); 
    }    

  });

  return trucksView;
  
});