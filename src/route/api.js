const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const { verifySession } = require('supertokens-node/recipe/session/framework/express');
const { supertokens } = require('supertokens-node');
const user = require('../controller/api/user.js');
const product = require('../controller/api/product.js');
const helper = require('../helper/support.js');

const multer  = require('multer');

const DIR = process.env.UPLOAD_FILE_PATH;

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, DIR);
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.toLowerCase().split(' ').join('-');
		cb(null, uuidv4() + '-' + fileName)
	}
});

var upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
			cb(null, true);
		} else {
		cb(null, false);
			return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
		}
	}
});

/*routes for product functionality*/
router
	.get('/product/products',helper.authenticateToken,async (req,res)=>{
		result = await product.products(req,res);
		res.status(result.statusCode || 401).send(result)
	})
	.post('/product/create',helper.authenticateToken,upload.single('image'),async (req,res)=>{
		result = await product.createProduct(req,res);
		res.status(result.statusCode || 401).send(result)
	})
	.put('/product/update',helper.authenticateToken,async(req,res)=>{
		result = await product.updateProduct(req,res);
		res.status(result.statusCode || 401).send(result)
	})
	.delete('/product/delete',helper.authenticateToken,async(req,res)=>{
		result = await product.deleteProduct(req,res);
		res.status(result.statusCode || 401).send(result)
	});

/*for pload image in folder only*/
router.post('/profile', upload.single('image'), (req, res, next) => {
	const url = req.protocol + '://' + req.get('host')
	
	let imagePath = url + '/'+ DIR +'/' + req.file.filename
	
	res.status(201).json({image: imagePath});
	
});

/*user routes*/
router
	.get('/user/login',async (req,res)=>{
		result = await user.login(req,res);
		res.status(result.statusCode || 401).send(result)
	})
	.post('/user/register',async (req,res)=>{
		result = await user.register(req,res);
		res.status(result.statusCode || 401).send(result)
	})
	.get('/user/checkin',helper.authenticateToken,async (req,res)=>{
		res.status(200).send(true)
	})
	.put('/user/update',helper.authenticateToken, async(req,res)=>{
		result = await user.updateUser(req,res);
		res.status(result.statusCode || 401).send(result)
	})
	.delete('/user/delete',helper.authenticateToken,async(req,res)=>{
		result = await user.deleteUser(req,res);
		res.status(result.statusCode || 401).send(result)
	});

/*
supertoken working on user routes
Here '/api/auth' route is assigned to supertoken to handle functionality.
Configation is on index.js 
*/
router.get("/auth/getUserInfo", verifySession(), async(req, res) => {
		let userId = req.session?.getUserId();

		let userInfo = null
		if(supertokens){
			userInfo = await supertokens.getUser(userId)
		}
		/**
		 * 
		 * userInfo contains the following info:
		 * - emails
		 * - id
		 * - timeJoined
		 * - tenantIds
		 * - phone numbers
		 * - third party login info
		 * - all the login methods associated with this user.
		 * - information about if the user's email is verified or not.
		 * 
		*/
		res.status(200).send(userInfo || {})
	});


exports.routes = router;