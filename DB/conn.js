const mongoose = require("mongoose");

const URI = 'mongodb://localhost:27017/userauth';
const connectDB = async () => {
    await mongoose.connect(URI,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
    console.log('db connected')
}
module.exports = connectDB;