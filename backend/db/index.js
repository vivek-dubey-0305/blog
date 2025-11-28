import mongoose from "mongoose";
// const dotenv = require('dotenv');
// import dotenv from "dotenv";

// dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);
        console.log(`\nMONGODB Connected !! DB  HOST : ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("backend/db/index.js \n MONGOOSE DATABASE CONNECTION ERROR : ", error);
        process.exit(1);
    }
}

export default connectDB;