require('dotenv').config()

const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const supertokens = require('supertokens-node');
const { middleware } = require('supertokens-node/framework/express');

const apiRouter = require('./route/api.js')
const path=require('path');


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
}

server.use(cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
}));

server.use(middleware());

server.use(express.json());       // to support JSON-encoded bodies
server.use(express.urlencoded()); // to support URL-encoded bodies
server.use('/product/image/',express.static('./'+process.env.UPLOAD_FILE_PATH));


server.use((req,res,next)=>{
	console.log('midlleware',req);
	next();
})

server.use('/api',apiRouter.routes);

server.listen(8080,()=>{
	console.log('Server is working 8080');
})


