require('dotenv').config();
const connectDB = require('./db/connect');
const Image = require('./models/image');


const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        await Image.create({
            name: 'image1',
            url: 'https://www.google.com',
            size: { width: 100, height: 100 },
            tags: ['tag1', 'tag2'],
            categories: ['cat1', 'cat2']
        });
        console.log('Image created');
    } catch (error) {
        console.log(error);
    }
};
start();