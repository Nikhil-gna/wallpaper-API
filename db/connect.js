const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI;
// "mongodb+srv://gampalanikhilanand:oj44Wso7RWs2zw1T@wallpaperapi.rqszozj.mongodb.net/wallpaperAPI?retryWrites=true&w=majority";
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to the database!');
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDB;