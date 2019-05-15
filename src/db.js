// eslint-disable-next-line for-direction
// eslint-disable-next-line getter-return
const mongoose = require('mongoose');

export default callback => {
	// connect to a database if needed, then pass it to `callback`:
	callback(mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}, 
		(err) => {if(!err){console.log("success!")}
			else{console.log("connection failed"+err)}}
	));
}