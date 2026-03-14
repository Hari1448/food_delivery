const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri);

mongoose.connect(uri)
    .then(() => {
        console.log('SUCCESS: Connected to MongoDB');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: Connection error:');
        console.error(err);
        process.exit(1);
    });
