
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 * Getters
 *
 * tags: ["tag1", "tag2", "tag3"]
 *
 * return "tag1,tag2,tag3"
 */
var getTags = function (tags) {
  return tags.join(',');
}

/**
 * Setters
 * 
 *  tags: "tag1,tag2,tag3"  or   ["tag1","tag2","tag3"]
 *      
 */
var setTags = function (tags) {
	
	//Check to see if tags is an array.
	if( Object.prototype.toString.call( tags ) === '[object Array]' ) {
		return tags;
	}

	//conver string to array and trim values;
	tags = tags.split(','); 
	tags.forEach(function(value, index){
  		tags[index] = value.trim();
  	});

  	return tags;
}

var TruckSchema = new Schema({

	truckId: {type:String, unique: true, required: true, trim:true},
	name: {type:String, required: true, trim:true},
	type: {type:String, trim:true},
	foodItems: {type:String, trim:true},
	address: {type:String, trim:true},
	longitude: {type:String, trim:true},
	latitude: {type:String, trim:true},
	block: {type:String, trim:true},
    createdDate  : {type : Date, default : Date.now},
    modifiedDate  : {type : Date}

});

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
			.sort({'createdDate': -1}) //sort by date, -1 (desc) or 1 (asc)
//			.sort({'title': 'asc'}) //sort by date
//			.sort({'title': 'asc'}) //sort by date
		.limit(options.limit)
			.skip(options.limit * options.page)
			.exec(cb);
	}

}

module.exports = mongoose.model('Truck', TruckSchema);
