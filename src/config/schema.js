rule = {};

const validation = (mongoose,key) =>{
	let user = mongoose.model('User',mongoose.Schema({
		fullName:{
			type:String, 
			required:true,
			validate: {
		      validator: function(v) {
		        return /^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$/.test(v);
		      },
		      // message: props => `${props.value} is not a valid name`
		    },
		},
		email:{
			type:String,
			required:true,
			validate:{
				validator:function(v){
					return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
				}
				// message:props => `${props.value} is not a valid email`
			}	
		},
		mobileNo:{
			type:Number,
			min:9,
			max:11
		},
		dob:{
			type:Date,
			required:true
		},
		gender:{
			type:String,
			enum: ['Male', 'Female'],
		}
	}));

	console.log('HH',user);

	return user;
}

exports.validation = validation;