const userModel = require('../../model/userModel.js');

exports.register = async(req,res) =>{
	let userData = req.body || null;
	if(userData){
		return await userModel.register(userData);
	} 
	return {statusCode:400,msg:'Something Wrong',data:[]};
}

exports.updateUser = async(req,res) =>{
	let userData = req.body || null;
	let loginUser = req.user || null;

	if(userData){
		return await userModel.updateUser(userData,loginUser);
	} 
	return {statusCode:400,msg:'Something Wrong',data:[]};
}

exports.login = async(req,res) =>{
	let userData = req.body || null;
	if(userData){
		return await userModel.login(userData);
	} 
	return {statusCode:400,msg:'Something Wrong',data:[]};
}

exports.checkin = async(req,res) =>{
	let token = req.body.token || null;
	if(token){
		return await userModel.checkin(token);
	} 
	return {statusCode:400,msg:'Something Wrong',data:[]};
}

exports.deleteUser = async(req,res) =>{
	let loginUser = req.user || null;

	if(loginUser){
		return await userModel.deleteUser(loginUser);
	} 
	return {statusCode:400,msg:'Something Wrong',data:[]};
}