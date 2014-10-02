
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TruckSchema = new Schema({

	truckId: {type:String, unique: true, required: true, trim:true},
	name: {type:String, required: true, trim:true},
	type: {type:String, trim:true},
	foodItems: {type:String, trim:true},
	address: {type:String, trim:true},
	loc: { type: { type: Number }, coordinates: [] },
	block: {type:String, trim:true},
    createdDate  : {type : Date, default : Date.now},
    modifiedDate  : {type : Date}

});

TruckSchema.index({ loc: '2d' });

TruckSchema.method('toClient', function() {

    var obj = this.toObject();

	//remove _ from id's
	if (obj._id){
	    obj.id = obj._id;
	    delete obj._id;
	}

    return obj;
});



// pre save hooks
TruckSchema.pre('save', function(next) {

  if(!this.isNew) {
    this.modifiedDate = new Date;
  }
  
  return next();

});


/**
 * Validations
 */

TruckSchema.path('truckId').validate(function (truckId) {
  return truckId.length > 0
}, 'Truck Id cannot be blank');


/*
  static methods
*/
TruckSchema.statics = {

	loadBy: function (opts, cb) {
		this.findOne(opts)
		  .exec(cb);
	},

	loadById: function (id, cb) {
		this.findOne({ _id : id })
		  .exec(cb);
	},
 
	list: function(options, cb){

		var criteria = options.criteria || {};

		this.find(criteria)
		.limit(options.limit)
			.skip(options.limit * options.page)
			.exec(cb);
	}

}

module.exports = mongoose.model('Truck', TruckSchema);
