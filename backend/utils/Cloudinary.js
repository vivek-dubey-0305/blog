import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv";

// Load environment variables
dotenv.config();


import fs from "fs";


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET

});


const uploadOnCloudinary = async (localFilePath) => {
    console.log(process.env.CLOUDINARY_CLOUD_NAME); // should print your Cloudinary cloud name
    console.log(process.env.CLOUDINARY_API_KEY);    // should print your Cloudinary API key
    console.log(process.env.CLOUDINARY_API_SECRET); // should print your Cloudinary API secret
    try {
        console.log("------------------CLOUDINARY.JS------------------")

        if (!localFilePath) {
            // console.log("under the if condition, no files have been uploaded");
            return "No file have uploaded";

            
        }
        // console.log("LOCAL FILE PATH: ", localFilePath)
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image"
        });

        //file has been uploaded successfully
        // console.log("FILE UPLOADED ON CLOUDINARY", response.url);
        // fs.unlinkSync(localFilePath);
        // console.log("UNLINKED SUCCESSFULLY")
        return response.url;

    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        fs.unlinkSync(localFilePath);
        return null;
    } finally {
        fs.unlinkSync(localFilePath);
    }
}


export { uploadOnCloudinary };