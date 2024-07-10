const productModel = require('../../model/productModel.js');

exports.createProduct = async(req,res) =>{
	let productData = req.body || null;
	if(productData){
		// const url = req.protocol + '://' + req.get('host')
		// productData['image'] = url + '/'+ (process.env.UPLOAD_FILE_PATH) +'/' + req.file.filename
		productData['image'] = (process.env.UPLOAD_FILE_PATH) +'/' + req.file.filename
		
		return await productModel.createProduct(productData);
	} 
	return {statusCode:400,msg:'Something Wrong',data:[]};
}

exports.updateProduct = async(req,res) =>{
	let product = req.body || null;
	let loginUser = req.user || null;

	if(product){
		return await productModel.updateProduct(product,loginUser);
	} 
	return {statusCode:400,msg:'Something Wrong',data:[]};
}

exports.deleteProduct = async(req,res) =>{
	let loginUser = req.user || null;
	let productId = req.query.productId || null;

	if(loginUser){
		return await productModel.deleteProduct(productId,loginUser);
	} 
	return {statusCode:400,msg:'Something Wrong',data:[]};
}

exports.products = async(req,res) =>{
	let loginUser = req.user || null;
	let query = req.query || {};
	let productId = query.productId || null;


	if(loginUser){
		return await productModel.products(productId,loginUser);
	} 
	return {statusCode:400,msg:'Something Wrong',data:[]};
}