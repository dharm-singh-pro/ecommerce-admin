const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const helper = require('../helper/support.js');
const { unlink } = require('node:fs/promises');

const Product = mongoose.model('Product',mongoose.Schema({
	
	productName:{
		type:String, 
		required:[true,'This field is required'],
		validate: {
	      validator: function(v) {
	        return /^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/.test(v);
	      },
	      message:'{VALUE} is not a valid name'
	    },
	},
	serialNo:{
		type:Number,
		min:1,
	},
	dom:{
		type:Date,
		required:[true,'This field is required']
	},
	type:{
		type:String,
		enum: ['Veg', 'Non-veg'],
	},
	image:{
		type:String,
		required:[true,'This field is required']
	}
},{ collection: 'product'}));


exports.createProduct = async(productData) =>{
	productDoc = new Product(productData);
	let output = {statusCode:400,msg:'Something Wrong',data:[]}; 

	try{
		existEntry = await Product.exists({'productName':productData.productName??''});
		
		if(!helper.isEmpty(existEntry)){
			throw {'errors':{'productName':{'message':'Product already exists!'}}};
		}

		console.log(productData);

		result = await productDoc.save();
		output = {statusCode:201,msg:'Product is created successfully',data:{'product':result}};

	}catch(error){
		let errors = {};
		if(error.errors){
			Object.keys(error.errors).forEach((key) => {
		        errors[key] = error.errors[key].message;
				error.errors[key].message;
		     });
		}

		(async function(path) {
		  try {
		    await unlink(path);
		    console.log(`successfully deleted ${path}`);
		  } catch (error) {
		    console.error('there was an error:', error.message);
		  }
		})(productData.image);
		output['msg'] = errors;
	}

	return output;
}

exports.updateProduct = async(product,loginUser) =>{
	let output = {statusCode:400,msg:'Something Wrong',data:[]}; 

	try{
		id = loginUser.id??'';

		productId = product.id??'';
		updateData = product.updateData??{};

		validProduct = await Product.findOne({_id:new ObjectId(productId)??''});

		if(helper.isEmpty(validProduct)){
			throw {'errors':{'_id':{'message':'Product not exist.'}}};
		}

		existEntry = await Product.exists({$and:[{_id:{$not:{$eq:new ObjectId(productId)}}},{productName:updateData.productName??null}]});
		
		if(!helper.isEmpty(existEntry)){
			throw {'errors':{'email':{'message':'Product already exists!'}}};
		}

		result = await Product.findOneAndUpdate({_id:new ObjectId(productId)},{ $set: { ...updateData }},{new:true,runValidators:true});
		output = {statusCode:201,msg:'Product is updated successfully',data:{'product':result}};
	}catch(error){
		console.log(error);
		let errors = {};
		if(error.errors){
			Object.keys(error.errors).forEach((key) => {
		        errors[key] = error.errors[key].message;
				error.errors[key].message;
		     });
		}
		output['msg'] = errors;
	}

	return output;
}


exports.deleteProduct = async(productId,loginUser) =>{
	let output = {statusCode:400,msg:'Something Wrong',data:[]}; 

	try{
		id = loginUser.id??'';

		console.log('>>',productId);
		validProduct = await Product.findOne({_id:new ObjectId(productId)??''});

		if(helper.isEmpty(validProduct)){
			throw {'errors':{'_id':{'message':'Product not exist.'}}};
		}

		result = await Product.findOneAndDelete({_id:new ObjectId(productId)},{new:true,runValidators:true});
		output = {statusCode:201,msg:'Product is deleted successfully',data:{'product':result}};
	}catch(error){
		console.log(error);
		let errors = {};
		if(error.errors){
			Object.keys(error.errors).forEach((key) => {
		        errors[key] = error.errors[key].message;
				error.errors[key].message;
		     });
		}
		output['msg'] = errors;
	}

	return output;
}

exports.products = async(productId,loginUser) =>{
	let output = {statusCode:400,msg:'Something Wrong',data:[]}; 

	try{
		let findCause = {};
		if(!helper.isEmpty(productId)){
			findCause = {_id:new ObjectId(productId)};
		}

		result = await Product.find(findCause);

		output = {statusCode:201,msg:`Product ${result.length} are found successfully`,data:{'product':result}};
	}catch(error){
		console.log(error);
		let errors = {};
		if(error.errors){
			Object.keys(error.errors).forEach((key) => {
		        errors[key] = error.errors[key].message;
				error.errors[key].message;
		     });
		}
		output['msg'] = errors;
	}

	return output;
}