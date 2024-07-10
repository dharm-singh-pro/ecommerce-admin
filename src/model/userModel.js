const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const helper = require('../helper/support.js');
const mail = require('../library/mail.js');

const User = mongoose.model('User',mongoose.Schema({
	// id:{
	// 	type:String,
	// },
	fullName:{
		type:String, 
		required:[true,'This field is required'],
		validate: {
	      validator: function(v) {
	        return /^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/.test(v);
	      },
	      message:'{VALUE} is not a valid name'
	    },
	},
	email:{
		type:String,
		required:[true,'This field is required'],
		validate:{
			validator:function(v){
				return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
			},
			message:'{VALUE} is not a valid email'
		}
	},
	mobileNo:{
		type:Number,
		min:9,
		max:11
	},
	dob:{
		type:Date,
		required:[true,'This field is required']
	},
	gender:{
		type:String,
		enum: ['Male', 'Female'],
	},
	password:{
		type:String,
		required:[true,'This field is required'],
	}
},{ collection: 'user'}));

const Login = mongoose.model('Login',mongoose.Schema({
	userId:{type:String,required:[true,'This field is required']},
	token:{type:String,required:true},
	tokenExpireAt:{type:Date},
},{ collection: 'login',timestamps: true }))


exports.register = async(userData) =>{
	userDoc = new User(userData);
	let output = {statusCode:400,msg:'Something Wrong',data:[]}; 

	try{
		existEntry = await User.exists({'email':userData.email??''});
		
		if(!helper.isEmpty(existEntry)){
			throw {'errors':{'email':{'message':'Email already exist!'}}};
		}

		result = await userDoc.save();
		output = {statusCode:201,msg:'User is created successfully',data:{'user':result}};

		mail.sendEMail({to:userData.email,subject:'Account created',html:`<h1>Hi ${userData.fullName}, <p>Do enjoy to be connected us.</p> </h1>`})
	
	}catch(error){
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

exports.login = async(userData) =>{
	let output = {statusCode:400,msg:'Something Wrong',data:[]}; 

	console.log('Data>>',userData);

	try{
		validUser = await User.findOne({'email':userData.email??'','password':userData.password??''});
		

		if(helper.isEmpty(validUser)){
			throw {'errors':{'email':{'message':'Email or Password does not exist!'}}};
		}

		token = helper.generateAccessToken({id:validUser.id,email:validUser.email});
		now = new Date();
		now.setDate(now.getHours() + 1);
		userId = validUser._id;

		loginData = {userId:userId,token:token,tokenExpireAt:now} 

		console.log('>>',validUser);
		console.log('>>',loginData);
		userDoc = new Login(loginData);
		result = await userDoc.save();
		output = {statusCode:201,msg:'User loign successfully',data:{'token':token}};
	}catch(error){
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

exports.updateUser = async(userData,loginUser) =>{
	let output = {statusCode:400,msg:'Something Wrong',data:[]}; 

	try{
		id = loginUser.id??'';

		validUser = await User.findOne({_id:new ObjectId(id)??''});

		if(helper.isEmpty(validUser)){
			throw {'errors':{'_id':{'message':'User not exist.'}}};
		}

		existEntry = await User.exists({$and:[{_id:{$not:{$eq:new ObjectId(id)}}},{email:userData.email??null}]});
		
		if(!helper.isEmpty(existEntry)){
			throw {'errors':{'email':{'message':'Email already exist!'}}};
		}

		result = await User.findOneAndUpdate({_id:new ObjectId(id)},{ $set: { ...userData }},{new:true,runValidators:true});
		output = {statusCode:201,msg:'User is updated successfully',data:{'user':result}};
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


exports.deleteUser = async(loginUser) =>{
	let output = {statusCode:400,msg:'Something Wrong',data:[]}; 

	try{
		id = loginUser.id??'';

		validUser = await User.findOne({_id:new ObjectId(id)??''});

		if(helper.isEmpty(validUser)){
			throw {'errors':{'_id':{'message':'User not exist.'}}};
		}

		

		result = await User.findOneAndDelete({_id:new ObjectId(id)},{new:true,runValidators:true});
		output = {statusCode:201,msg:'User is deleted successfully',data:{'user':result}};
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